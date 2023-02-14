import React from 'react';
import {Component} from 'react';
import {Course, SOC} from "../scripts/soc";
import CircularProgress from '@mui/material/CircularProgress';

type myStates = {
    current_courses: Course[];
}

export default class MainDisplay extends Component<{}, myStates> {
    constructor(props: any) {
        super(props);
        this.state = {
            current_courses: [],
        }
    }

    async componentDidMount(): Promise<any> {
        let soc = await SOC.fetchSOC('https://raw.githubusercontent.com/ufosc/Schedule_Helper/main/dev/schedule_of_courses/soc_scraped.json')

        let coursesToDisplay: Course[] = [];
        coursesToDisplay.push(await (await soc).getCourse("CDA3101"));
        coursesToDisplay.push(await (await soc).getCourse("COP3530"));
        coursesToDisplay.push(await (await soc).getCourse("ENC3246"));
        coursesToDisplay.push(await (await soc).getCourse("MAP2302"));
        coursesToDisplay.push(await (await soc).getCourse("MHF3202"));

        let combinations = 1;
        for (const c of coursesToDisplay) {
            console.log(c.sections.length);
            combinations *= c.sections.length;
        }
        console.log("# of Combinations = " + combinations);

        this.setState({current_courses: coursesToDisplay});

        return coursesToDisplay;
    }

    render() {
        const courses = this.state.current_courses.map((course) => {
            const sections = course.sections.map((section) => {
                return (
                    <div className="inline-block m-1">
                        <div className="w-full min-h-10 p-2 rounded-lg shadow-sm shadow-slate-400">
                            <div className="flex flex-row justify-between items-center">
                                <p className="text-lg text-slate-600">{section.number}</p>
                            </div>

                            <p className="text-lg text-slate-400">{section.displayName}</p>
                            <p className="text-lg text-slate-400"><i>{section.instructors.join(', ')}</i></p>
                        </div>
                    </div>
                );
            });

            return (
                <div className="mb-3"> {/* COURSES */}
                    {/* Course Information */}
                    <p className="mx-4 text-xl text-slate-700 underline"><b>{course.code}</b> {course.name}</p>
                    <div className="mx-5">
                        <p className="text-slate-700">{course.description}</p>
                    </div>


                    <div className="mx-6 my-2"> {/* SECTIONS */}
                        {sections} {/* Section Cards */}
                    </div>
                </div>
            )
        });

        if (courses.length === 0) {
            return (
                <>
                    <b>Loading Courses...</b>
                    <br/>
                    <CircularProgress/>
                </>
            );
        } else {
            return (
                <>
                    <p className="m-4 text-2xl text-slate-700">Schedule Helper 📆</p>

                    {courses}
                </>
            );
        }
    }
}
