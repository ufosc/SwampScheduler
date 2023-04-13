import {Schedule} from "../scripts/generator";
import {Component} from "react";
import {MeetTime, Section} from "../scripts/soc";
import {ReactFitty} from "react-fitty";
import classNames from "classnames";
import {API_Day, API_Days} from "../scripts/apiTypes";

interface Props {
    schedule: Schedule,
    courseColors: string[]
}

interface States {
}

type MeetTimeInfo = {
    meetTime: MeetTime,
    courseColor: string,
    courseNum: number
}

export default class ScheduleDisplay extends Component<Props, States> {
    // TODO: redo this (it is *disgusting*)
    render() {
        // TODO: this is suspiciously similar to Meetings class
        let blockSchedule: Map<API_Day, (MeetTimeInfo | null)[]> = new Map(
            API_Days.map((day: API_Day) => [day, new Array(11).fill(null)])
        );

        this.props.schedule.forEach((section: Section, s: number) => {
            for (const [day, mTs] of section.meetTimes) {
                for (const mT of mTs) {
                    for (let p: number = mT.pBegin ?? 12; p <= mT.pEnd ?? -1; ++p)
                        blockSchedule.get(day)[p - 1] = blockSchedule.get(day)[p - 1] = {
                            meetTime: mT,
                            courseColor: this.props.courseColors[s % this.props.courseColors.length],
                            courseNum: s + 1
                        };
                }
            }
        });

        // TODO: this is unnecessary
        let arrays: Array<(MeetTimeInfo | null)[]> = [];
        for (const [_, x] of blockSchedule)
            arrays.push(x);

        let divs = [];
        for (let p = 0; p < 11; ++p) {
            for (let d = 0; d < 5; ++d) {
                //TODO: make this not absolutely horrible :)
                const meetTimeInfo: MeetTimeInfo | null = arrays[d][p];

                if (meetTimeInfo == null) {
                    divs.push(
                        <div
                            className={classNames(['border-solid', 'border-2', 'border-gray-300', 'rounded', 'whitespace-nowrap', 'text-center', 'h-6'])}>
                        </div>
                    );
                    continue;
                }

                const mT: MeetTime = meetTimeInfo.meetTime;
                const color: string = meetTimeInfo.courseColor;
                const courseNum: number = meetTimeInfo.courseNum

                let location: JSX.Element = <i>TBD</i>;
                if (mT.bldg && mT.room)
                    location = <>{mT.bldg} {mT.room}</>;

                if (mT.pBegin != mT.pEnd && (p == 0 || arrays[d][p - 1] == null || arrays[d][p - 1].meetTime != mT)) {
                    // TODO: why do I have to do this garbage??
                    const spanMap: Map<number, string> = new Map<number, string>([
                        [2, 'row-span-2'],
                        [3, 'row-span-3'],
                        [4, 'row-span-4'],
                        [5, 'row-span-5'],
                        [6, 'row-span-6']
                    ]);
                    let span: string = spanMap.get(Math.min(1 + (mT.pEnd - mT.pBegin), 6));

                    divs.push(
                        <div className={classNames(
                            ['border-solid', 'border-2', 'border-gray-400', color, 'rounded', 'whitespace-nowrap', 'text-center', span])}>
                            <ReactFitty minSize={0} maxSize={14} className={"px-0.5"}>
                                {location}<sup><b>{courseNum}</b></sup>
                            </ReactFitty>
                        </div>
                    );
                } else if (!(p > 0 && mT != null && arrays[d][p - 1] != null && arrays[d][p - 1].meetTime == mT))
                    divs.push(
                        <div className={classNames(
                            ['border-solid', 'border-2', 'border-gray-400', color, 'rounded', 'whitespace-nowrap', 'text-center', 'h-6'])}>
                            <ReactFitty minSize={0} maxSize={14} className={"px-0.5"}>
                                {location}<sup><b>{courseNum}</b></sup>
                            </ReactFitty>
                        </div>
                    );
            }
        }

        return (
            <div className={"text-sm"}>
                <div className={"min-w-full w-5/12 my-1"}>
                    <div className={"flex gap-1"}>
                        {this.props.schedule.map((sec: Section, s: number) =>
                            <div className={classNames(
                                ['border-solid', 'border-2', 'border-gray-400', this.props.courseColors[s], 'rounded', 'text-center', 'grow'])}>
                                <b>({s + 1})</b> Sec. {sec.number} [{sec.courseCode}]
                            </div>
                        )}
                    </div>
                </div>

                <div className={"min-w-full w-5/12 my-1 flex gap-1"}>
                    <div className={"inline-block h-max"}>
                        <div className={"grid grid-cols-1 gap-y-1"}>
                            {[...Array(11).keys()].map(p =>
                                <div
                                    className={"border-solid border-2 border-gray-400 bg-gray-200 rounded text-center w-full h-6 px-0.5"}>
                                    <b>P{p + 1}</b>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className={"inline-block grow"}>
                        <div className={"grid grid-cols-5 grid-rows-11 gap-1"}>
                            {divs}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
