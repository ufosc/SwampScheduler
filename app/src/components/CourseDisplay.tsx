import React from "react";
import {Course, Section} from "@src/scripts/soc";
import SectionDisplay from "@src/components/SectionDisplay";
// @ts-ignore
import {Draggable} from "react-drag-and-drop";

interface Props {
    course: Course
}

export default function CourseDisplay(props: Props) {
    const sectionDisplays = props.course.sections.map((section: Section) =>
        <SectionDisplay key={section.uid} section={section} draggable={true}/>
    );

    return (
        <> {/* COURSE */}
           {/* Title Bar */}
            <div>
                {/* Course Code & Name */}
                <span className="text-slate-700 underline">
                    <b>{props.course.code}</b> {props.course.name}
                </span>
                {" "}
                <Draggable className={"inline-block"} type={'uid'} data={props.course.uid}>📌️</Draggable>
            </div>

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
