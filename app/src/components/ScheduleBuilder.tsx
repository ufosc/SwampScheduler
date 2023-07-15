import React, {Component} from "react";
import {Course, Section, SOC} from "@src/scripts/soc";
import {Generator, Schedule, Selection} from "@src/scripts/generator";
import SectionPicker from "@src/components/SectionPicker";
import MultipleSelectionDisplay from "@src/components/MultipleSelectionDisplay";
import MultipleScheduleDisplay from "@src/components/MultipleScheduleDisplay";

const defaultSelections: Selection[] = [new Selection()];

interface Props {
}

interface States {
    soc: SOC | null,
    generator: Generator | null,
    selections: Selection[],
    schedules: Schedule[],
    showAddCourse: boolean
}

const defaultState = {
    soc: null,
    generator: null,
    selections: defaultSelections,
    schedules: [],
    showAddCourse: false
};

export default class ScheduleBuilder extends Component<Props, States> {
    constructor(props: Props) {
        super(props);
        this.state = defaultState;
    }

    componentDidMount() {
        // TODO: implement retry upon fetch error
        SOC.fetchSOC()
            .then(soc => this.setState({soc: soc, generator: new Generator(soc)}));
    }

    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<States>) {
        // If selections were changed, generate new schedules
        if (this.state.selections != prevState.selections) {
            if (this.state.generator) { // Make sure generator is not null
                this.state.generator.loadSelections( // Generate schedules from non-empty selections
                    this.state.selections.filter((sel: Selection) => sel.length > 0)
                );
                this.state.generator.generateSchedules()
                    .then((schedules: Schedule[]) => this.setState({schedules: schedules}));
                console.log("Selections were changed, so schedules have been regenerated", this.state.schedules);
            }
        }

        // If schedules changed, log schedules
        if (prevState.schedules != this.state.schedules)
            console.log("New schedules", this.state.schedules);
    }

    async handleDrop(ind: number, uid: string) {
        if (this.state.soc) { // Make sure SOC exists
            const item: Section | Course | null = await this.state.soc.get(uid);
            console.log("Handling drop; will try to add", item);

            if (item) { // Make sure a match was found (not null)
                // Get the section(s) to try to add to selection
                let sectionsToTryAdd: Section[];
                if (item instanceof Course)
                    sectionsToTryAdd = item.sections;
                else
                    sectionsToTryAdd = [item];

                // Get the sections that have not been added to a selection
                const sectionsToAdd: Section[] = sectionsToTryAdd.filter(
                    section => !this.state.selections.some( // TODO: extract to a Selections class
                        sel => sel.includes(section)
                    )
                );
                this.newSelection(ind, sectionsToAdd); // Add the section that have not been added
            }
        }
    }

    // TODO: make separate functions
    newSelection(ind: number = -1, sectionsToAdd: Section[] = []) {
        if (ind == -1) {
            this.setState({selections: [...this.state.selections, new Selection()]});
            return;
        }

        let newSelections = this.state.selections.map((sel, i) => {
            if (i == ind) return [...sel, ...sectionsToAdd];
            return sel;
        });
        this.setState({selections: newSelections});
    }

    handleDeleteSelection(ind: number) {
        let newSelections = this.state.selections.filter((sel, i) => (i != ind));
        if (newSelections.length == 0)
            newSelections = defaultSelections;

        this.setState({selections: newSelections});
    }

    handleRemove(sectionToRemove: Section) {
        let newSelections = this.state.selections.map((sel) =>
            sel.filter((sec) => (sec != sectionToRemove))
        );
        this.setState({selections: newSelections});
    }

    render() {
        // Show loading screen if SOC has not been fetched
        if (this.state.soc === null)
            return (
                <div>
                    <h1>Loading SOC...</h1>
                </div>
            );

        return (
            <div className="min-h-screen flex flex-col h-screen p-3">
                {/* Title & Term Selector */}
                <div className="flex">
                    <p className="text-2xl text-slate-700 inline-block">Schedule Helper 📆</p>

                    <div className="grow"></div>

                    <select id="term"
                            className="bg-sky-500 hover:bg-sky-400 border border-blue-300 text-white text-sm rounded-lg p-2.5 mr-1"
                            defaultValue={this.state.soc.info.termStr}>
                        <option value={this.state.soc.info.termStr}>
                            {this.state.soc.info.term} {this.state.soc.info.year}, {this.state.soc.info.program}
                        </option>
                    </select>
                </div>

                <hr className="my-1.5"></hr>

                {/* Main of Builder */}
                <main className="flex flex-row overflow-y-hidden h-full p-1">
                    {/* Picker */}
                    <div className="overflow-y-auto w-full">
                        <SectionPicker soc={this.state.soc}/>
                    </div>

                    {/* Selected */}
                    <div className="overflow-y-auto w-full p-1">
                        <MultipleSelectionDisplay selections={this.state.selections}
                                                  handleDrop={this.handleDrop.bind(this)}
                                                  newSelection={this.newSelection.bind(this)}
                                                  handleRemove={this.handleRemove.bind(this)}
                                                  handleDeleteSelection={this.handleDeleteSelection.bind(this)}
                        />
                    </div>

                    {/* Generated Schedules */}
                    <div className="overflow-y-auto w-full p-1">
                        <MultipleScheduleDisplay schedules={this.state.schedules}/>
                    </div>
                </main>
            </div>
        );
    }
}
