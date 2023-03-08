/*
===========================================================================================================
This is a duplicate implementation of SectionDisplay.tsx but as a button.
I decided to add this rather than replace the old section display incase we change our minds on formatting.
===========================================================================================================
*/

import React from 'react';
import {Section} from "../scripts/soc";

type propType = {
    section: Section;
    isClicked: boolean;
    onclick: (section: Section) => void;
};

export default function SectionDisplay(props: propType) {
    const section = props.section;
    let times = [];
    section.meetTimes.forEach((value, key) => {
        if (value.length > 0) {
            times.push(key + ": " + value[0].periodBegin + "-" + value[0].periodEnd + " ");
        }
    });

    if (times.length == 0) {
        times = ["Online"]
    }

    if (props.isClicked) {
        return (
            <button className="inline-block m-1" onClick={() => props.onclick(section)}> {/* SECTION */}
                <div className="w-full bg-blue-200 min-h-10 p-2 rounded-lg shadow-sm shadow-slate-400">
                    <div className="flex flex-row justify-between items-center">
                        <p className="text-lg text-slate-600">{section.number}</p>
                    </div>
    
                    <p className="text-lg text-slate-400">{section.displayName}</p>
                    <p className="text-lg text-slate-400"><i>{section.instructors.join(', ')}</i></p>
                    <p className="text-lg text-slate-400">{times}</p>
                </div>
            </button>
        );
    }
    else {
        return (
            <button className="inline-block m-1" onClick={() => props.onclick(section)}> {/* SECTION */}
                <div className="w-full min-h-10 p-2 rounded-lg shadow-sm shadow-slate-400">
                    <div className="flex flex-row justify-between items-center">
                        <p className="text-lg text-slate-600">{section.number}</p>
                    </div>
    
                    <p className="text-lg text-slate-400">{section.displayName}</p>
                    <p className="text-lg text-slate-400"><i>{section.instructors.join(', ')}</i></p>
                    <p className="text-lg text-slate-400">{times}</p>
                </div>
            </button>
        );
    }
}