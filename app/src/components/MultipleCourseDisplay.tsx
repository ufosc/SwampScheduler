import React, {Component} from 'react';
import {Course} from "../scripts/soc";
import CourseDisplay from './CourseDisplay';

type propType = {
    courses: Course[];
    handleDelete: (course: Course) => void;
}

type stateType = {}

export default class MultipleCourseDisplay extends Component<propType, stateType> {
    constructor(props: propType) {
        super(props);
        this.state = {}
    }

    componentDidUpdate(prevProps: Readonly<{}>, prevState: Readonly<stateType>, snapshot?: any): void {
        if (this.props !== prevProps) {
            this.setState({current_courses: this.props.courses});
        }
    }

    render() {
        const courses = this.props.courses.map((course: Course) => {
            return (<CourseDisplay course={course} handleDelete={this.props.handleDelete}/>)
        });

        if (courses.length === 0)
            return (
                <div className={"block"}>
                    <b>No courses, add a course...</b>
                </div>
            );

        return (
            <div className={"block"}>
                {courses}
            </div>
        );
    }
}