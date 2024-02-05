import React, {Component} from "react";
import classNames from "classnames";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {ReactFitty} from "react-fitty";
import {API_Day, API_Days} from "@scripts/apiTypes";
import {MeetTime, Section} from "@scripts/soc";
import {Schedule} from "@scripts/scheduleGenerator";
import {getSectionColor} from "@constants/frontend";
import {PERIOD_COUNTS} from "@constants/schedule";
import {GrPersonalComputer} from "react-icons/gr";
//import "rrule"
import ical, {ICalEventRepeatingFreq} from 'ical-generator';

interface Props {
    schedule: Schedule;
}

interface States {
}

// TODO: reconsider what to store
type MeetTimeInfo = {
    meetTime: MeetTime;
    courseColor: string;
    courseNum: number;
    sectionIsOnline: boolean;
};

export default class ScheduleDisplay extends Component<Props, States> {
    // TODO: redo this (it is *disgusting*); maybe there is a library that does the work

    handleExportScheduleClick = async () => {
        try {
            // Create a new iCal calendar
            const cal = ical();

            const startTime = new Date();
            const endTime = new Date();
            endTime.setHours(startTime.getHours()+1);

            const event = cal.createEvent({
                start: startTime,
                end: endTime,
                summary: 'Example Event',
                description: 'It works ;)',
                location: 'my room',
                url: 'http://sebbo.net/',
            });

            event.repeating({
                freq: ICalEventRepeatingFreq.WEEKLY,
                until: new Date('Feb 28 2024 00:00:00 UTC')
            });

            // Convert the calendar to an iCalendar string
            const icalContent = cal.toString();

            // Create a Blob from the iCalendar content
            const file = new File([icalContent], 'ExampleEvent.ics', { type: 'text/calendar' });

            // Create a URL for the Blob
            const url = URL.createObjectURL(file);

            // Create a temporary anchor element and trigger the download
            const anchor = document.createElement('a');
            anchor.href = url;
            anchor.download = 'ExampleEvent.ics';
            document.body.appendChild(anchor);
            anchor.click();
            document.body.removeChild(anchor);

            // Revoke the URL to release memory
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error exporting schedule:', error);
            // Handle the error appropriately
        }
    };

    render() {

        const schedule = this.props.schedule,
            periodCounts = PERIOD_COUNTS[schedule.term];

        // TODO: this is suspiciously similar to Meetings class
        const blockSchedule: Record<API_Day, (MeetTimeInfo | null)[]> = {
            [API_Day.Mon]: new Array(periodCounts.all).fill(null),
            [API_Day.Tue]: new Array(periodCounts.all).fill(null),
            [API_Day.Wed]: new Array(periodCounts.all).fill(null),
            [API_Day.Thu]: new Array(periodCounts.all).fill(null),
            [API_Day.Fri]: new Array(periodCounts.all).fill(null),
            [API_Day.Sat]: new Array(periodCounts.all).fill(null),
        };

        schedule.forEach((section: Section, s: number) =>
            API_Days.forEach((day) =>
                section.meetings[day].forEach((mT) => {
                    const info: MeetTimeInfo = {
                        meetTime: mT,
                        courseColor: getSectionColor(s),
                        courseNum: s + 1,
                        sectionIsOnline: section.isOnline,
                    };
                    for (
                        let p = mT.periodBegin ?? periodCounts.all;
                        p <= mT.periodEnd ?? -1;
                        ++p
                    )
                        blockSchedule[day][p - 1] = info;
                }),
            ),
        );


        const divs = [];
        for (let p = 0; p < periodCounts.all; ++p) {
            for (const day of API_Days) {
                // TODO: make this a checkbox or automatically change format to 6 days if schedule has a Saturday course
                if (day == API_Day.Sat) continue;

                //TODO: make this not absolutely horrible :)
                const meetTimeInfo: MeetTimeInfo | null = blockSchedule[day][p];

                if (meetTimeInfo == null) {
                    // No course
                    divs.push(
                        <div
                            className={classNames([
                                "border-solid",
                                "border-2",
                                "border-gray-300",
                                "rounded",
                                "whitespace-nowrap",
                                "text-center",
                                "h-6",
                            ])}
                        ></div>,
                    );
                    continue;
                }

                const mT = meetTimeInfo.meetTime,
                    color = meetTimeInfo.courseColor,
                    courseNum = meetTimeInfo.courseNum;

                let location: React.JSX.Element = <i>TBD</i>;
                if (mT.location) location = <>{mT.location}</>;

                if (
                    mT.periodBegin != mT.periodEnd &&
                    (p == 0 ||
                        blockSchedule[day][p - 1] == null ||
                        blockSchedule[day][p - 1]!.meetTime != mT)
                ) {
                    // TODO: why do I have to do this garbage??
                    const spanMap: Map<number, string> = new Map<
                        number,
                        string
                    >([
                        [2, "row-span-2"],
                        [3, "row-span-3"],
                        [4, "row-span-4"],
                        [5, "row-span-5"],
                        [6, "row-span-6"],
                    ]);
                    const span: string = spanMap.get(
                        Math.min(1 + (mT.periodEnd - mT.periodBegin), 6),
                    )!; // TODO: error handling for NaN

                    divs.push(
                        <div
                            className={classNames([
                                "border-solid",
                                "border-2",
                                "border-gray-400",
                                color,
                                "rounded",
                                "whitespace-nowrap",
                                "text-center",
                                span,
                            ])}
                        >
                            <div className={"flex items-center h-full"}>
                                <ReactFitty
                                    minSize={0}
                                    maxSize={14}
                                    className={"px-0.5"}
                                >
                                    {location}
                                    <sup>
                                        <b>{courseNum}</b>
                                    </sup>
                                </ReactFitty>
                            </div>
                        </div>,
                    );
                } else if (
                    !(
                        p > 0 &&
                        mT != null &&
                        blockSchedule[day][p - 1] != null &&
                        blockSchedule[day][p - 1]!.meetTime == mT
                    )
                )
                    divs.push(
                        <div
                            className={classNames([
                                "border-solid",
                                "border-2",
                                "border-gray-400",
                                color,
                                "rounded",
                                "whitespace-nowrap",
                                "text-center",
                                "h-6",
                            ])}
                        >
                            <ReactFitty
                                minSize={0}
                                maxSize={14}
                                className={"px-0.5"}
                            >
                                {location}
                                <sup>
                                    <b>{courseNum}</b>
                                </sup>
                            </ReactFitty>
                        </div>,
                    );
            }
        }

        const onlineSections: Section[] = schedule.filter((s) => s.isOnline);

        return (
            <div className={"text-sm"}>
                <button onClick={this.handleExportScheduleClick} className={"bg-sky-500 hover:bg-sky-400 border border-blue-300 text-white text-sm rounded-lg p-1.5 mr-1 text-center mt-1.5 mb-1.5"}>
                    Export Schedule
                </button>
                <div className={"min-w-full w-5/12 my-1"}>
                    <div className={"flex gap-1"}>
                        {schedule.map((sec: Section, s: number) => (
                            <div
                                className={classNames([
                                    "border-solid",
                                    "border-2",
                                    "border-gray-400",
                                    getSectionColor(s),
                                    "rounded",
                                    "text-center",
                                    "grow",
                                ])}
                            >
                                <b>({s + 1})</b> Sec. {sec.number} [
                                {sec.courseCode}]
                            </div>
                        ))}
                    </div>
                </div>

                <div className={"min-w-full w-5/12 my-1 flex gap-1"}>
                    <div className={"inline-block h-max"}>
                        <div className={"grid grid-cols-1 gap-y-1"}>
                            {[...Array(periodCounts.all).keys()]
                                .map((p) => p + 1)
                                .map((p) => (
                                    <div
                                        className={
                                            "border-solid border-2 border-gray-400 bg-gray-200 rounded text-center w-full h-6 px-0.5 min-w-full"
                                        }
                                    >
                                        <b>
                                            {MeetTime.formatPeriod(
                                                p,
                                                schedule.term,
                                            )}
                                        </b>
                                    </div>
                                ))}

                            {onlineSections.length > 0 && (
                                <div
                                    className={
                                        "border-solid border-2 border-gray-400 bg-gray-200 rounded text-center w-full h-6 px-0.5 min-w-full"
                                    }
                                >
                                    <div
                                        className={
                                            "flex items-center justify-center"
                                        }
                                    >
                                        <GrPersonalComputer/>️
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className={"inline-block grow"}>
                        <div className={"grid grid-cols-5 grid-rows-11 gap-1"}>
                            {divs}
                            {onlineSections.length > 0 && (
                                <div className={"col-span-5"}>
                                    <div className={"min-w-full w-5/12 h-full"}>
                                        <div className={"flex gap-1"}>
                                            {onlineSections.map(
                                                (sec: Section, ind: number) => (
                                                    <div
                                                        className={classNames([
                                                            "border-solid",
                                                            "border-2",
                                                            "border-gray-400",
                                                            getSectionColor(
                                                                ind,
                                                            ),
                                                            "rounded",
                                                            "text-center",
                                                            "grow",
                                                        ])}
                                                    >
                                                        {sec.displayName}
                                                        <sup>
                                                            <b>{1 + ind}</b>
                                                        </sup>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
