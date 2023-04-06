import {Schedule} from "../scripts/generator";
import {Component} from "react";
import {MeetTime, Section} from "../scripts/soc";
import {ReactFitty} from "react-fitty";
import classNames from "classnames";

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
        let blockSchedule: Map<string, MeetTimeInfo[]> = new Map([
            ["M", [null, null, null, null, null, null, null, null, null, null, null]],
            ["T", [null, null, null, null, null, null, null, null, null, null, null]],
            ["W", [null, null, null, null, null, null, null, null, null, null, null]],
            ["R", [null, null, null, null, null, null, null, null, null, null, null]],
            ["F", [null, null, null, null, null, null, null, null, null, null, null]]
        ]);

        this.props.schedule.forEach((section: Section, s: number) => {
            for (const [day, meetTimes] of section.meetTimes) {
                for (const mT of meetTimes) {
                    for (let p: number = mT.pBegin ?? 12; p <= mT.pEnd ?? -1; ++p)
                        blockSchedule.get(day)[p - 1] = blockSchedule.get(day)[p - 1] = {
                            meetTime: mT,
                            courseColor: this.props.courseColors[s % this.props.courseColors.length],
                            courseNum: s + 1
                        };
                }
            }
        });

        let arrays: Array<MeetTimeInfo[]> = [];
        for (const [_, x] of blockSchedule)
            arrays.push(x);

        let divs = [];
        for (let p = 0; p < 11; ++p) {
            for (let d = 0; d < 5; ++d) {
                //TODO: make this not absolutely horrible :)
                const meetTimeInfo: MeetTimeInfo = arrays[d][p] ?? {meetTime: null, courseColor: null, courseNum: null};

                const mT: MeetTime = meetTimeInfo.meetTime;
                const color: string = meetTimeInfo.courseColor;
                const courseNum: number = meetTimeInfo.courseNum

                let location = <></>;
                if (mT) {
                    location = <i>TBD</i>;
                    if (mT.bldg && mT.room)
                        location = <>{mT.bldg} {mT.room}</>;
                } else {
                    divs.push(
                        <div
                            className={['border-solid', 'border-2', 'border-gray-300', 'rounded', 'whitespace-nowrap', 'h-6'].join(' ')}>
                        </div>
                    );
                    continue;
                }

                if (mT.pBegin != mT.pEnd && (p == 0 || arrays[d][p - 1] == null || arrays[d][p - 1].meetTime != mT)) {
                    // TODO: why do I have to do this garbage??
                    const spanMap: Map<number, string> = new Map<number, string>([
                        [2, 'row-span-2'],
                        [3, 'row-span-3'],
                        [4, 'row-span-4'],
                        [5, 'row-span-5'],
                        [6, 'row-span-6']
                    ]);
                    let span: string = spanMap.get(1 + (mT.pEnd - mT.pBegin));

                    divs.push(
                        <div
                            className={classNames(
                                ['border-solid', 'border-2', 'border-gray-400', color, 'rounded', 'whitespace-nowrap', 'text-center', span])}>
                            <ReactFitty minSize={0} maxSize={14} className={"px-0.5"}>
                                {location}<sup><b>{courseNum}</b></sup>
                            </ReactFitty>
                        </div>
                    );
                } else if (!(p > 0 && mT != null && arrays[d][p - 1] != null && arrays[d][p - 1].meetTime == mT))
                    divs.push(
                        <div
                            className={['border-solid', 'border-2', 'border-gray-400', color, 'rounded', 'whitespace-nowrap'].join(' ')}>
                            <div className={"h-5 text-center"}>
                                <ReactFitty minSize={0} maxSize={14}>
                                    {location}<sup><b>{courseNum}</b></sup>
                                </ReactFitty>
                            </div>
                        </div>
                    );
            }
        }

        return (
            <div className={"text-sm"}>
                <div className={"min-w-full w-5/12 my-1"}>
                    <div className={"flex gap-1"}>
                        {this.props.schedule.map((sec: Section, s: number) =>
                            <div
                                className={['border-solid', 'border-2', 'border-gray-400', this.props.courseColors[s], 'rounded', 'text-center', 'grow'].join(' ')}>
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
                                    className={"border-solid border-2 border-gray-400 bg-gray-200 rounded text-center w-full px-0.5"}>
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


// import {Schedule} from "../scripts/generator";
// import {Component} from "react";
// import {MeetTime, Section} from "../scripts/soc";
//
// interface Props {
//     schedule: Schedule,
//     courseColors: string[]
// }
//
// interface States {
// }
//
// type MeetTimeInfo = {
//     meetTime: MeetTime,
//     courseColor: string,
//     courseNum: number
// }
//
// export default class ScheduleDisplay extends Component<Props, States> {
//     // TODO: redo this (it is *disgusting*)
//     render() {
//         let blockSchedule: Map<string, Array<MeetTimeInfo>> = new Map([
//             ["M", [null, null, null, null, null, null, null, null, null, null, null]],
//             ["T", [null, null, null, null, null, null, null, null, null, null, null]],
//             ["W", [null, null, null, null, null, null, null, null, null, null, null]],
//             ["R", [null, null, null, null, null, null, null, null, null, null, null]],
//             ["F", [null, null, null, null, null, null, null, null, null, null, null]]
//         ]);
//
//         this.props.schedule.forEach((section: Section, s: number) => {
//             for (const [day, meetTimes] of section.meetTimes) {
//                 for (const meetTime of meetTimes) {
//                     for (let p = meetTime.periodBegin ?? 12; p <= meetTime.periodEnd ?? -1; ++p) {
//                         blockSchedule.get(day)[p - 1] = {
//                             meetTime: meetTime,
//                             courseColor: this.props.courseColors[s % this.props.courseColors.length],
//                             courseNum: s + 1
//                         };
//                     }
//                 }
//             }
//         });
//
//         let arrays: Array<Array<MeetTimeInfo>> = [];
//         for (const [_, x] of blockSchedule)
//             arrays.push(x);
//
//         let divs: JSX.Element[] = [];
//         for (let d = 0; d < 5; ++d) {
//             let dayDivs: JSX.Element[] = []
//             for (let p = 0; p < 11; ++p) {
//                 const meetTimeInfo: MeetTimeInfo = arrays[d][p] ?? {meetTime: null, courseColor: null, courseNum: null};
//
//                 const meetTime: MeetTime = meetTimeInfo.meetTime;
//                 const color: string = meetTimeInfo.courseColor;
//                 const courseNum: number = meetTimeInfo.courseNum
//
//                 let location = <>*</>;
//                 if (meetTime) {
//                     location = <i>TBD</i>;
//                     if (meetTime.bldg && meetTime.room)
//                         location = <>{meetTime.bldg + ' ' + meetTime.room}</>;
//                 }
//
//                 dayDivs.push(
//                     <div
//                         className={['border-solid', 'border-2', 'border-gray-400', color, 'rounded', 'text-center', 'whitespace-nowrap', 'overflow-scroll', 'grow'].join(' ')}>
//                         {location}<b><sup>{courseNum}</sup></b>
//                     </div>
//                 );
//             }
//             divs.push(<div className={"flex flex-col gap-y-1 flex-grow flex-shrink"}>{dayDivs}</div>);
//         }
//
//         return (
//             <div className={"text-sm"}>
//                 <div className={"min-w-full w-5/12 my-1"}>
//                     <div className={"flex gap-1"}>
//                         {this.props.schedule.map((sec: Section, s: number) =>
//                             <div
//                                 className={['border-solid', 'border-2', 'border-gray-400', this.props.courseColors[s], 'rounded', 'text-center', 'grow'].join(' ')}>
//                                 <b>({s + 1})</b> Sec. {sec.number} [{sec.courseCode}]
//                             </div>
//                         )}
//                     </div>
//                 </div>
//
//                 <div className={"min-w-full w-5/12 my-1 flex gap-1"}>
//                     <div className={"inline-block"}>
//                         <div className={"grid grid-cols-1 gap-1"}>
//                             {[...Array(11).keys()].map(p =>
//                                 <div
//                                     className={"border-solid border-2 border-gray-400 bg-gray-200 rounded text-center px-0.5"}>
//                                     <b>P{p + 1}</b>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//
//                     <div className={"inline-block grow"}>
//                         <div className={"flex gap-x-1"}>
//                             {divs}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         );
//     }
// }
