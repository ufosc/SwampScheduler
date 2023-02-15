import React from 'react';
import {Component} from 'react';
import {Course, SOC} from "../scripts/soc";
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import CircularProgress from '@mui/material/CircularProgress';
import SectionDisplay from './SectionDisplay';
import ClassDisplay from './ClassDisplay';

type myStates = {
    
}

type myProps = {
    courses: Course[];
    handleDelete: (course: Course) => void;
}

export default class MainDisplay extends Component<myProps, myStates> {
    constructor(props: any) {
        super(props);
        this.state = {
            
        }
    }

    componentDidUpdate(prevProps: Readonly<{}>, prevState: Readonly<myStates>, snapshot?: any): void {
        if (this.props !== prevProps) {
            this.setState({current_courses: this.props.courses});
        }
    }

    render() {
        const courses = this.props.courses.map((course) => {
            const sections = course.sections.map((section) => {
                return (
                    <SectionDisplay section={section} />
                );
            });

            return (
                <ClassDisplay course={course} sections={sections} handleDelete={this.props.handleDelete}/>
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
