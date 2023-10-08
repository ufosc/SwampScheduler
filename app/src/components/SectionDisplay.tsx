import React from "react";
import { Section } from "@scripts/soc";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Draggable } from "react-drag-and-drop";
import { GrClose, GrLock } from "react-icons/gr";
import { CampusMap } from "@scripts/api";
import { API_Days } from "@scripts/apiTypes.ts";
import { notNullish } from "@scripts/utils.ts";

interface Props {
    section: Section;
    draggable?: boolean;
    handleRemove?: (sectionToRemove: Section) => void;
}

export default function SectionDisplay({
    section,
    draggable = false,
    handleRemove,
}: Props) {
    const allTimes: React.JSX.Element[] = API_Days.map((day, d) =>
        section.meetings[day].length > 0 ? (
            <div className="mx-1" key={d}>
                <b>{day}:</b>{" "}
                {section.meetings[day].map((mT, m) => (
                    <span key={m}>
                        {CampusMap.createLink(
                            mT.locationID,
                            `${mT.location}`,
                            <>{mT.formatPeriods()}</>,
                        )}{" "}
                    </span>
                ))}
            </div>
        ) : null,
    ).filter(notNullish);

    return (
        <Draggable
            className={"inline-block"}
            type={"uid"}
            data={section.uid}
            enabled={draggable}
        >
            <div className="m-1 text-sm">
                {" "}
                {/* SECTION */}
                <div className="w-full p-2 rounded-lg shadow-sm shadow-slate-400">
                    <div className={"text-slate-600 flex justify-between dark:text-white"}>
                        <div className={"flex items-center gap-1"}>
                            <b>{section.number}</b>
                            <span className={"text-xs align-middle"}>
                                ({section.credits.display} Credits)
                            </span>
                        </div>
                        <button
                            className={"mx-1"}
                            hidden={!handleRemove}
                            onClick={() =>
                                handleRemove && handleRemove(section)
                            }
                        >
                            <GrClose />
                        </button>
                    </div>

                    <div className={"text-slate-400 dark:text-white"}>
                        <p className={"flex items-center gap-1"}>
                            {section.deptControlled && (
                                <abbr title={"Departmentally Controlled"}>
                                    <GrLock />
                                </abbr>
                            )}
                            {section.displayName}
                        </p>
                        <p>
                            <i>{section.instructors.join(", ")}</i>
                        </p>
                        <div className={"flex flex-row justify-around"}>
                            {allTimes}
                        </div>
                    </div>
                </div>
            </div>
        </Draggable>
    );
}
