import React, {Component} from "react";
import {MeetTime, Section} from "@scripts/soc";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {Draggable} from "react-drag-and-drop";
import {GrClose} from "react-icons/gr"
import {CampusMap} from "@scripts/api";

interface Props {
    section: Section,
    draggable: boolean,
    handleRemove: (sectionToRemove: Section) => void
}

interface States {
}

const defaultProps = {
    draggable: false,
    handleRemove: null
}

export default class SectionDisplay extends Component<Props, States> {
    static defaultProps = defaultProps;

    render() {
        // TODO: refactor
        let allTimes: React.JSX.Element[] = [];
        this.props.section.meetings.forEach((mTs: MeetTime[], day: string) => {
            if (mTs.length > 0) {
                const times: React.JSX.Element[] = [];
                mTs.forEach((mT: MeetTime) => {
                    times.push(
                        <span>
                            {CampusMap.createLink(
                                mT.locationID,
                                `${mT.bldg} ${mT.room}`,
                                <>{mT.formatPeriods()}</>
                            )}
                            {" "}
                        </span>
                    );
                });
                allTimes.push(
                    <div className="mx-1">
                        <b>{day}:</b> {times}
                    </div>
                );
            }
        });

        if (this.props.section.isOnline())
            allTimes.unshift(<b>Online</b>);
        else if (allTimes.length == 0) // Not online, but no times have been assigned
            allTimes = [<>TBD</>]

        return (
            <Draggable className={"inline-block"} type={'uid'} data={this.props.section.uid}
                       enabled={this.props.draggable}>
                <div className="m-1 text-sm"> {/* SECTION */}
                    <div className="w-full p-2 rounded-lg shadow-sm shadow-slate-400">
                        <div className={"text-slate-600 flex justify-between"}>
                            <b>{this.props.section.number}</b>

                            <button className={"mx-1"}
                                    hidden={!this.props.handleRemove}
                                    onClick={() => this.props.handleRemove(this.props.section)}
                            >
                                <GrClose/>
                            </button>
                        </div>

                        <div className={"text-slate-400"}>
                            <p>{this.props.section.displayName}</p>
                            <p><i>{this.props.section.instructors.join(', ')}</i></p>
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
