import React, {Component} from 'react';
import {Section, SOC} from "../scripts/soc";
import {Generator, Schedule, Selection} from "../scripts/generator";
import ScheduleDisplay from "./ScheduleDisplay";
import SectionPicker from './SectionPicker';
import MultipleSelectionDisplay from "./MultipleSelectionDisplay";
import MultipleScheduleDisplay from "./MultipleScheduleDisplay";

const SOC_URL: string = 'https://raw.githubusercontent.com/ufosc/Schedule_Helper/main/dev/schedule_of_courses/soc_scraped.json';

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
        SOC.fetchSOC(SOC_URL)
            .then(soc => this.setState({soc: soc, generator: new Generator(soc)}));
    }

    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<States>) {
        // If selections were changed, generate new schedules
        if (this.state.selections != prevState.selections) {
            this.state.generator.loadSelections( // Generate schedules from non-empty selections
                this.state.selections.filter((sel: Selection) => sel.length > 0)
            );
            this.state.generator.generateSchedules()
                .then((schedules: Schedule[]) => this.setState({schedules: schedules}));
            console.log("Selections were changed, so schedules have been regenerated", this.state.schedules);
        }

        // If schedules changed, log schedules
        if (prevState.schedules != this.state.schedules)
            console.log("New schedules", this.state.schedules);
    }

    async handleDrop(ind: number, sectionNum: number) {
        // TODO: use unique section ID
        const section: Section = await this.state.soc.getSection(sectionNum);

        // Add section to specified selection if not in any selection
        for (const sel of this.state.selections)
            if (sel.includes(section))
                return;
        this.newSelection(ind, [section]);
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

        const schedules: Schedule[] = this.state.schedules;
        const renderSchedules = () => {
            return (
                <div>
                    <p className={"text-center"}><b><u>{schedules.length}</u> Schedules Generated</b></p>
                    {schedules.map((schedule: Schedule, i: number) =>
                        <div>
                            <p>{i + 1}</p>
                            <ScheduleDisplay schedule={schedule}
                                             courseColors={['bg-red-200', 'bg-blue-200', 'bg-purple-200', 'bg-green-200']}/>
                        </div>
                    )}
                </div>
            );
        }

        return (
            <div className="min-h-screen flex flex-col h-screen p-3">
                {/* Title */}
                <div>
                    <p className="text-2xl text-slate-700 mb-2">Schedule Helper 📆</p>
                    <hr className="my-1.5"></hr>
                </div>

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
