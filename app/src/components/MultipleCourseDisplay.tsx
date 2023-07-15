import React from "react";
import {Course} from "@src/scripts/soc";
import CourseDisplay from "@src/components/CourseDisplay";

interface Props {
    courses: Course[]
}

export default function MultipleCourseDisplay(props: Props) {
    const courses = props.courses.map((course: Course) =>
        <CourseDisplay key={course.uid} course={course}/>
    );

    return (
        <div>
            {courses}
        </div>
    );
}
