import React from 'react';
import {Component} from 'react';
import {Course, SOC} from "../scripts/soc";
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import CircularProgress from '@mui/material/CircularProgress';

type myStates = {
    current_courses: Course[];
}

type myProps = {
    courses: Course[];
    handleDelete: (course: Course) => void;
}

export default class MainDisplay extends Component<myProps, myStates> {
    constructor(props: any) {
        super(props);
        this.state = {
            current_courses: [],
        }
    }

    componentDidUpdate(prevProps: Readonly<{}>, prevState: Readonly<myStates>, snapshot?: any): void {
        if (this.props !== prevProps) {
            this.setState({current_courses: this.props.courses});
        }
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
                    <Button onClick={() => this.props.handleDelete(course)}>
                        delete
                    </Button>
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
                    <b>No courses, add a course...</b>
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
