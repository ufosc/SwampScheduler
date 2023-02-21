import React, {Component} from 'react';
import {Course, SOC} from "../scripts/soc";
import MultipleCourseDisplay from "./MultipleCourseDisplay";
import {Generator, Schedule, Selection} from "../scripts/generator";

type propType = {}

type stateType = {
    courses: Course[],
    searchText: string,
    soc: SOC,
    generator: Generator
    schedules: Schedule[]
}

export default class ScheduleBuilder extends Component<propType, stateType> {
    constructor(props: propType) {
        super(props);
        this.state = {
            courses: [],
            searchText: "",
            soc: null,
            generator: null,
            schedules: []
        };
    }

    componentDidMount() {
        SOC.fetchSOC('https://raw.githubusercontent.com/ufosc/Schedule_Helper/main/dev/schedule_of_courses/soc_scraped.json')
            .then(soc => this.setState({soc: soc, generator: new Generator(soc)}));
    }

    componentDidUpdate(prevProps: Readonly<propType>, prevState: Readonly<stateType>) {
        if (prevState.courses != this.state.courses) {
            // TODO: allow for specific sections in a selection (not just whole courses)
            let selections: Selection[] = this.state.courses.map(
                (course: Course) => {
                    return course.sections;
                }
            );

            this.state.generator.loadSelections(selections);
            this.state.generator.generateSchedules()
                .then((schedules: Schedule[]) => this.setState({schedules: schedules}));
        }
        if (prevState.schedules != this.state.schedules)
            console.log(this.state.schedules);
    }

    handleDelete = (course: Course) => {
        console.log("Deleting " + course.code);
        this.setState({courses: this.state.courses.filter((c) => c !== course)});
    }

    handleSubmit = async (event) => {
        event.preventDefault();

        let course: Course = await (this.state.soc).getCourse(this.state.searchText);

        if (course == undefined)
            console.log("Course not found");
        else if (this.state.courses.find((c) => c === course) !== undefined)
            console.log("Course already added");
        else {
            this.setState({courses: [...this.state.courses, course]})
            console.log(this.state.courses)
        }
    }

    render() {
        if (this.state.soc === null) {
            return (
                <div>
                    <h1>Loading SOC...</h1>
                </div>
            )
        }

        return (
            <div className={"m-4"}>
                <p className="text-2xl text-slate-700 mb-2">Schedule Helper 📆</p>

                <form onSubmit={this.handleSubmit}>
                    <div>
                        <input type={"text"}
                               className={"bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5"}
                               placeholder={"Course Code"}
                               onChange={(event) => this.setState({searchText: event.target.value})}></input>

                        <button type="submit"
                                className="m-1 top-0 right-0 p-2.5 text-sm font-medium text-white bg-blue-700 rounded-r-lg rounded-l-lg border border-blue-700 ">
                            Add
                        </button>
                    </div>
                </form>

                <hr className={"my-1.5"}></hr>

                <MultipleCourseDisplay courses={this.state.courses} handleDelete={this.handleDelete}/>
            </div>
        );
    }
}