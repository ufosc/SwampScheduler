import React from 'react';

export default function SectionDisplay(props: any) {
    const section = props.section;
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
}