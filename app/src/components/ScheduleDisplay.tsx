import {Schedule} from "../scripts/generator";
import {Component} from "react";
import {MeetTime, Section} from "../scripts/soc";

interface Props {
    schedule: Schedule
}

interface States {
}

export default class ScheduleDisplay extends Component<Props, States> {
    // TODO: redo this (it is *disgusting*)
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

                let location = (<>*</>);
                if (meetTime) {
                    location = (<i>TBD</i>);
                    if (meetTime.bldg && meetTime.room)
                        location = (<>{meetTime.bldg + ' ' + meetTime.room}</>);
                }

                divs.push(
                    <div className={"border-solid border-2 border-teal-400 rounded text-center"}>
                        {location}
                    </div>
                );
            }
        }

        return (
            <>
                {this.props.schedule.map((sec: Section) => (sec.number + ' [' + sec.courseCode + ']')).join(', ')}
                <div className={"min-w-full w-5/12 pb-6"}>
                    <div className={"grid grid-cols-5 gap-1"}>
                        {divs}
                    </div>
                </div>
            </>
        );
    }
}