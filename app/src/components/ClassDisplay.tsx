import React from "react";
import Button from "@mui/material/Button";

export default function ClassDisplay(props: any) {
    const course = props.course;
    const sections = props.sections;
    const handleDelete = props.handleDelete;
    
    return (
        <div className="mb-3"> {/* COURSES */}
            {/* Course Information */}
            <p className="mx-4 text-xl text-slate-700 underline"><b>{course.code}</b> {course.name}</p>
            <Button onClick={() => handleDelete(course)}>
                delete
            </Button>
            <div className="mx-5">
                <p className="text-slate-700">{course.description}</p>
            </div>


            <div className="mx-6 my-2"> {/* SECTIONS */}
                {sections} {/* Section Cards */}
            </div>
        </div>
    );
}