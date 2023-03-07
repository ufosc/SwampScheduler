import {Schedule} from "../scripts/generator";
import {Component} from "react";
import {MeetTime} from "../scripts/soc";

type propType = {
    schedule: Schedule
}

type stateType = {}

export default class ScheduleDisplay extends Component<propType, stateType> {
    constructor(props: propType) {
        super(props);
        this.state = {};
    }

    render() {
        let blockSchedule: Map<string, MeetTime[]> = new Map([
            ["M", [null, null, null, null, null, null, null, null, null, null, null]],
            ["T", [null, null, null, null, null, null, null, null, null, null, null]],
            ["W", [null, null, null, null, null, null, null, null, null, null, null]],
            ["R", [null, null, null, null, null, null, null, null, null, null, null]],
            ["F", [null, null, null, null, null, null, null, null, null, null, null]]
        ]);

        for (const section of this.props.schedule) {
            for (const [day, meetTimes] of section.meetTimes) {
                for (const meetTime of meetTimes) {
                    for (let p = meetTime.periodBegin ?? 12; p <= meetTime.periodEnd ?? -1; ++p) {
                        // console.log(day, p, blockSchedule, meetTime);
                        blockSchedule.get(day)[p - 1] = meetTime;
                    }
                }
            }
        }

        let arrays: Array<MeetTime[]> = [];
        for (const [_, x] of blockSchedule)
            arrays.push(x);

        let divs = [];
        for (let p = 0; p < 11; ++p) {
            for (let d = 0; d < 5; ++d) {
                const meetTime = arrays[d][p];
                if (meetTime != null)
                    divs.push(<div
                        className={"border-solid border-2 border-teal-400 rounded text-center"}>{arrays[d][p].room} @ {arrays[d][p].bldg}</div>);
                else
                    divs.push(<div className={"border-solid border-2 border-teal-400 rounded text-center"}>*</div>);
            }
        }

        return (
            <div className={"min-w-full w-5/12 pb-6"}>
                <div className={"grid grid-cols-5 gap-1"}>
                    {divs}
                </div>
            </div>
        );
    }
}