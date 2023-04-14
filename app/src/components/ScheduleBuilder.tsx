import React, {Component} from 'react';
import { Transition } from '@headlessui/react'
import {Section, SOC} from "../scripts/soc";
import {Generator, Schedule, Selection} from "../scripts/generator";
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
    showAddCourse: boolean,
    extendSchedule: boolean,
    otherbool: boolean
}

const defaultState = {
    soc: null,
    generator: null,
    selections: defaultSelections,
    schedules: [],
    showAddCourse: false,
    extendSchedule: false,
    otherbool: true,
};

export default class ScheduleBuilder extends Component<Props, States> {
    constructor(props: Props) {
        super(props);
        this.state = defaultState;
        this.handleExtendSchedules = this.handleExtendSchedules.bind(this);
    }

    componentDidMount() {
        // TODO: implement retry upon fetch error
        SOC.fetchSOC(SOC_URL)
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

    async handleDrop(ind: number, sectionNum: number) {
        if (this.state.soc) { // Make sure SOC exists
            // TODO: use unique section ID
            const section: Section | null = await this.state.soc.getSection(sectionNum);

            if (section) { // Make sure a match was found (not null)
                // Add section to specified selection if not in any selection
                for (const sel of this.state.selections)
                    if (sel.includes(section))
                        return;
                this.newSelection(ind, [section]);
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

    handleExtendSchedules() {
        setTimeout(() => {
            this.setState({extendSchedule: !this.state.extendSchedule})
            this.setState({otherbool: !this.state.otherbool})
        }, 0)
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
                {/* Title */}
                <div>
                    <p className="text-2xl text-slate-700 mb-2">Schedule Helper 📆</p>
                    <hr className="mt-1.5"></hr>
                </div>

                {/* Main of Builder */}
                <main className="relative overflow-y-hidden h-full">
                    <div className="absolute flex flex-row overflow-y-hidden h-full w-full p-1"
                        
                    >

                        {/* Picker */}
                        <div className='overflow-y-auto w-full'>
                                <SectionPicker soc={this.state.soc}/>
                        </div>

                        {/* Selected */}
                        {/* NOTE this does not properly enter due to a big with the droppable in selection display with the transition library */}
                        <div className='overflow-y-auto w-full p-1'>
                            <MultipleSelectionDisplay selections={this.state.selections}
                                handleDrop={this.handleDrop.bind(this)}
                                newSelection={this.newSelection.bind(this)}
                                handleRemove={this.handleRemove.bind(this)}
                                handleDeleteSelection={this.handleDeleteSelection.bind(this)}
                            />
                        </div>

                        {/* Schedules (small) */}
                        <div className='overflow-y-auto w-full'>
                            <MultipleScheduleDisplay schedules={this.state.schedules}/>
                        </div>

                    </div>

                    {/* Schedules (BIG) */}
                    <Transition className="absolute flex flex-row overflow-y-hidden h-full w-full p-1 bg-white"
                        show={this.state.extendSchedule}
                        enter={`transition ease-in-out duration-1000 transform`}
                        enterFrom="translate-y-full"
                        enterTo="translate-y-0"
                        leave={`transition ease-in-out duration-1000 transform`}
                        leaveFrom="translate-y-0"
                        leaveTo="translate-y-full"
                    >
                        <div className='overflow-y-auto w-full'>
                            <MultipleScheduleDisplay schedules={this.state.schedules}/>
                        </div>
                    </Transition>
                </main>
                <button onClick={this.handleExtendSchedules} className='bottom-0 rounded left-0 w-full py-3 border-2 border-sky-500 bg-white text-center text-sky-500 text-xs hover:bg-sky-500 hover:text-white'>^</button>
            </div>
        );
    }
}
