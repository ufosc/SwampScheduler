import React from 'react';
import {Course} from "../scripts/soc";
import CourseDisplay from './CourseDisplay';

interface Props {
    courses: Course[]
}

export default function MultipleCourseDisplay(props: Props) {
    const courses = props.courses.map((course: Course) =>
        <CourseDisplay course={course}/>
    );

    return (
        <div>
            {courses}
        </div>
    );
}
