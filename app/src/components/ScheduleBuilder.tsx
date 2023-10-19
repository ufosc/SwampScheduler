import { Component } from "react";
import { Course, Section, SOC_API, SOC_Generic, SectionJSON } from "@scripts/soc";
import {
    Schedule,
    ScheduleGenerator,
    Selection,
} from "@scripts/scheduleGenerator";
import SectionPicker from "@components/SectionPicker";
import MultipleSelectionDisplay from "@components/MultipleSelectionDisplay";
import MultipleScheduleDisplay from "@components/MultipleScheduleDisplay";
import { UF_SOC_API } from "@scripts/api";
import { API_Filters } from "@scripts/apiTypes";
import { arrayEquals, notEmpty, take } from "@scripts/utils";
import { LIMIT_VALUES, LIMITS } from "@constants/scheduleGenerator";

const getDefaultSelections = () => [new Selection()];
const defaultProgram = "CWSP";

interface Props {}

interface States {
    filters: API_Filters | null;
    soc: SOC_Generic | null;
    generator: ScheduleGenerator | null;
    limit: number;
    selections: Selection[];
    schedules: Schedule[];
    showAddCourse: boolean;
}

const defaultState: States = {
    filters: null,
    soc: null,
    generator: null,
    limit: LIMIT_VALUES[0],
    selections: getDefaultSelections(),
    schedules: [],
    showAddCourse: false,
};

export default class ScheduleBuilder extends Component<Props, States> {
    constructor(props: Props) {
        super(props);
        this.state = defaultState;
    }

    reset() {
        console.log("Resetting Schedule Builder");
        this.setState({
            selections: getDefaultSelections(),
            schedules: [],
        });
    }

    componentDidMount() {
        // TODO: implement retry upon fetch error
        UF_SOC_API.fetchFilters().then(async (filters) => {
            this.setState({ filters });
            await this.setSOC(filters.terms[0].CODE, defaultProgram);
        });
    }

    componentDidUpdate(
        _prevProps: Readonly<Props>,
        prevState: Readonly<States>,
    ) {
        // If limit was changed or a section was added/removed from a section, generate new schedules
        if (
            this.state.limit != prevState.limit ||
            !arrayEquals(
                this.state.selections.filter(notEmpty),
                prevState.selections.filter(notEmpty),
            )
        ) {
            console.log(`Modifying selections:${this.state.soc?.getSOCProgramString()},${this.state.soc?.getSOCTermString()}`)
            localStorage.setItem(`selections:${this.state.soc?.getSOCProgramString()},${this.state.soc?.getSOCTermString()}`, JSON.stringify(this.state.selections));
            if (this.state.generator) {
                // Make sure generator is not null
                this.state.generator.loadSelections(
                    // Generate schedules from non-empty selections
                    this.state.selections.filter(
                        (sel: Selection) => sel.length > 0,
                    ),
                );

                const newSchedules: Schedule[] = [
                    ...take(
                        this.state.limit,
                        this.state.generator.yieldSchedules(),
                    ),
                ];
                this.setState({ schedules: newSchedules });
                console.log(
                    "Selections were changed, so schedules have been regenerated",
                    newSchedules,
                );

                // If schedules changed, log schedules
                if (prevState.schedules != newSchedules)
                    console.log("New schedules", newSchedules);
                else console.log("Same schedules");
            }
        }
    }

    async setSOC(termStr: string, programStr: string) {
        console.log(`Setting SOC to "${termStr}" for "${programStr}"`);
        await SOC_API.initialize({ termStr, programStr }).then((soc) =>
            this.setState({
                soc: soc,
                generator: new ScheduleGenerator(soc),
            }),
        );
        this.reset(); // Make sure to only show info from the current SOC
        await this.loadStoredSelections(termStr, programStr);
    }

    async loadStoredSelections(termStr: string, programStr: string) {
        console.log(`looking for selections:${programStr},${termStr}`)
        const data = localStorage.getItem(`selections:${programStr},${termStr}`);
        if (data != null) {
            console.log("Stored selection data found")
            console.log(JSON.parse(data));
            let selectionArray = JSON.parse(data).map((selectionJson: SectionJSON[]): Selection => {
                return Selection.parseJSON(selectionJson);;
            });
            this.setState({ selections: selectionArray });
            console.log("parsed the selection array");
            console.log(selectionArray);
        } else {
            console.log("Stored selection data not present")
        }
    }

    async handleDrop(ind: number, uid: string) {
        if (this.state.soc) {
            // Make sure SOC exists
            const item: Section | Course | null = this.state.soc.get(uid);
            console.log("Handling drop; will try to add", item);

            if (item) {
                // Make sure a match was found (not null)
                // Get the section(s) to try to add to selection
                let sectionsToTryAdd: Section[];
                if (item instanceof Course) sectionsToTryAdd = item.sections;
                else sectionsToTryAdd = [item];

                // Get the sections that have not been added to a selection
                const sectionsToAdd: Section[] = sectionsToTryAdd.filter(
                    (section) =>
                        !this.state.selections.some(
                            // TODO: extract to a Selections class
                            (sel) => {
                                return sel.map((sec) => sec.uid === section.uid).some((truthVal) => truthVal);
                            }
                        ),
                );
                this.newSelection(ind, sectionsToAdd); // Add the section that have not been added
            }
            else {
                alert("Error dragging course or section to selections from search results. Please try re-running your search.")
            }
        }
    }

    // TODO: make separate functions
    newSelection(ind: number = -1, sectionsToAdd: Section[] = []) {
        if (ind == -1) {
            this.setState({
                selections: [...this.state.selections, new Selection()],
            });
            return;
        }

        const newSelections = this.state.selections.map((sel, i) => {
            if (i == ind) return [...sel, ...sectionsToAdd];
            return sel;
        });
        this.setState({ selections: newSelections });
    }

    handleDeleteSelection(ind: number) {
        let newSelections = this.state.selections.filter((_sel, i) => i != ind);
        if (newSelections.length == 0) newSelections = getDefaultSelections();

        this.setState({ selections: newSelections });
    }

    handleRemove(sectionToRemove: Section) {
        const newSelections = this.state.selections.map((sel) =>
            sel.filter((sec) => sec != sectionToRemove),
        );
        this.setState({ selections: newSelections });
    }

    render() {
        // Show loading screen if filters/terms haven't been fetched yet
        if (this.state.filters === null)
            return (
                <div>
                    <h1>Fetching latest semester information...</h1>
                </div>
            );
        if (this.state.soc === null)
            // Make sure SOC is set
            return (
                <div>
                    <h1>Setting latest Schedule of Courses...</h1>
                </div>
            );

        return (
            <div className="min-h-screen flex flex-col h-screen p-3">
                {/* Title & Term Selector */}
                <div className="flex">
                    <p className="text-2xl text-slate-700 inline-block">
                        🐊 Swamp Scheduler 📆
                    </p>

                    <div className="grow"></div>

                    <select
                        id="term"
                        className="bg-sky-500 hover:bg-sky-400 border border-blue-300 text-white text-sm rounded-lg p-2.5 mr-1 text-center"
                        defaultValue={this.state.soc.info.termStr}
                        onChange={(e) =>
                            this.setSOC(e.target.value, defaultProgram)
                        }
                        disabled={false}
                    >
                        {this.state.filters?.terms.map((t) => {
                            const { term, year } = SOC_Generic.decodeTermString(
                                t.CODE,
                            );
                            return (
                                <option value={t.CODE} key={t.CODE}>
                                    {term} {year}
                                </option>
                            );
                        })}
                    </select>

                    <select
                        id="limit"
                        className="bg-sky-500 hover:bg-sky-400 border border-blue-300 text-white text-sm rounded-lg p-2.5 mr-1 text-center"
                        defaultValue={this.state.limit}
                        onChange={(e) =>
                            this.setState({ limit: Number(e.target.value) })
                        }
                        disabled={false}
                    >
                        {LIMITS.map(([num, str]) => (
                            <option value={num} key={num}>
                                Generate ≤{str}
                            </option>
                        ))}
                    </select>
                </div>

                <hr className="my-1.5"></hr>

                {/* Main of Builder */}
                <main className="flex flex-row overflow-y-hidden h-full p-1">
                    {/* Picker */}
                    <div className="overflow-y-auto w-full">
                        <SectionPicker soc={this.state.soc} />
                    </div>

                    {/* Selected */}
                    <div className="overflow-y-auto w-full p-1">
                        <MultipleSelectionDisplay
                            selections={this.state.selections}
                            handleDrop={this.handleDrop.bind(this)}
                            newSelection={this.newSelection.bind(this)}
                            handleRemove={this.handleRemove.bind(this)}
                            handleDeleteSelection={this.handleDeleteSelection.bind(
                                this,
                            )}
                            key={new Date().getTime()}
                        />
                    </div>

                    {/* Generated Schedules */}
                    <div className="overflow-y-auto w-full p-1">
                        <MultipleScheduleDisplay
                            schedules={this.state.schedules}
                            key={new Date().getTime()}
                        />
                    </div>
                </main>
            </div>
        );
    }
}
