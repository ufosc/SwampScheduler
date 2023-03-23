import React from "react";
import {Course, Section} from "../scripts/soc";
import SectionDisplay from "./SectionDisplay";

interface Props {
    course: Course
}

export default function CourseDisplay(props: Props) {
    const sectionDisplays = props.course.sections.map((section: Section) =>
        <SectionDisplay section={section} draggable={true}/>
    );

    return (
        <> {/* COURSE */}
            {/* Course Code & Name */}
            <p className="text-slate-700 underline">
                <b>{props.course.code}</b> {props.course.name}
            </p>

            {/* Description */}
            <div className="mx-2">
                <p className="text-slate-700 text-sm">{props.course.description}</p>
            </div>

            {/* SECTIONS */}
            <div className="mx-3 my-2">
                {sectionDisplays}
            </div>
        </>
    );
}
