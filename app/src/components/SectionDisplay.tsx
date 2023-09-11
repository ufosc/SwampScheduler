import React, { Component } from "react";
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
    draggable: boolean;
    handleRemove: (sectionToRemove: Section) => void;
}

interface States {}

const defaultProps = {
    draggable: false,
    handleRemove: null,
};

export default class SectionDisplay extends Component<Props, States> {
    static defaultProps = defaultProps;

    render() {
        const section = this.props.section;

        // TODO: refactor
        let allTimes: React.JSX.Element[] = API_Days.map((day) =>
            section.meetings[day].length > 0 ? (
                <div className="mx-1">
                    <b>{day}:</b>{" "}
                    {section.meetings[day].map((mT) => (
                        <span>
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

        if (section.isOnline) allTimes.unshift(<b>Online</b>);
        else if (allTimes.length == 0)
            // Not online, but no times have been assigned
            allTimes = [<>TBD</>];

        return (
            <Draggable
                className={"inline-block"}
                type={"uid"}
                data={section.uid}
                enabled={this.props.draggable}
            >
                <div className="m-1 text-sm">
                    {" "}
                    {/* SECTION */}
                    <div className="w-full p-2 rounded-lg shadow-sm shadow-slate-400">
                        <div className={"text-slate-600 flex justify-between"}>
                            <div className={"flex items-center gap-1"}>
                                <b>{section.number}</b>
                                <span className={"text-xs align-middle"}>
                                    ({section.credits.display} Credits)
                                </span>
                            </div>
                            <button
                                className={"mx-1"}
                                hidden={!this.props.handleRemove}
                                onClick={() => this.props.handleRemove(section)}
                            >
                                <GrClose />
                            </button>
                        </div>

                        <div className={"text-slate-400"}>
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
}
