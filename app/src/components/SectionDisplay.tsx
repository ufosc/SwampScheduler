import {Component} from 'react';
import {MeetTime, Section} from "../scripts/soc";
import {Draggable} from 'react-drag-and-drop';
import {GrClose} from "react-icons/gr"
import {CampusMap} from "../scripts/api";

interface Props {
    section: Section,
    draggable: boolean,
    handleRemove
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
        let allTimes = [];
        this.props.section.meetTimes.forEach((mTs: MeetTime[], day: string) => {
            if (mTs.length > 0) {
                let times = [];
                mTs.forEach((mT: MeetTime) => {
                    times.push(
                        <>
                            {CampusMap.createLink(
                                mT.locationID,
                                <abbr title={mT.bldg + " " + mT.room}>
                                    {mT.pBegin == mT.pEnd ? mT.pBegin : mT.pBegin + "-" + mT.pEnd}
                                </abbr>
                            )}
                            {" "}
                        </>
                    );
                });
                allTimes.push(
                    <div className="mx-1">
                        <b>{day}:</b> {times}
                    </div>
                );
            }
        });

        // TODO: not necessarily true (times may not have been assigned, yet)
        if (allTimes.length == 0)
            allTimes = ["Online"]

        return (
            <Draggable className={"inline-block"} type={'section'} data={JSON.stringify(this.props.section)}
                       enabled={this.props.draggable}>
                <div className="m-1 text-sm"> {/* SECTION */}
                    <div className="w-full p-2 rounded-lg shadow-sm shadow-slate-400">
                        <div className={"text-slate-600 flex justify-between"}>
                            <b>{this.props.section.number}</b>

                            <button className={"mx-1"}
                                    hidden={this.props.handleRemove == null}
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
