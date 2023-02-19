import React from "react";
import {Section} from "../scripts/soc";
import SectionDisplay from "./SectionDisplay";

export default function CourseDisplay(props: any) {
    const course = props.course;
    const handleDelete = props.handleDelete;

    const sectionDisplays = course.sections.map((section: Section) => {
        return (<SectionDisplay section={section}/>);
    });

    return (
        <> {/* COURSE */}
            {/* Course Information */}
            <p className="text-xl text-slate-700 underline">
                <b>{course.code}</b> {course.name}
                <button onClick={() => handleDelete(course)} className={"mx-1"}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                         stroke="red" className="w-6 h-6 inline" style={{verticalAlign: 'text-bottom'}}>
                        <path
                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/>
                    </svg>
                </button>
            </p>

            <div className="mx-2">
                <p className="text-slate-700">{course.description}</p>
            </div>

            <div className="mx-3 my-2"> {/* SECTIONS */}
                {sectionDisplays}
            </div>
        </>
    );
}