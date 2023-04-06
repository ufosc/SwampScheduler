import {Schedule} from "../scripts/generator";
import ScheduleDisplay from "./ScheduleDisplay";
import React from "react";

interface Props {
    schedules: Schedule[]
}

export default function MultipleScheduleDisplay(props: Props) {
    const courseColors: string[] = [
        'bg-red-200',
        'bg-lime-200',
        'bg-cyan-200',
        'bg-fuchsia-200',
        'bg-amber-200',
        'bg-green-200',
        'bg-orange-200'
    ];

    return (
        <div>
            <p className={"text-center"}>
                <b><u>{props.schedules.length}</u> Schedules Generated</b>
            </p>

            {props.schedules.map((schedule: Schedule, i: number) =>
                <div>
                    <u>Schedule #{i + 1}</u>
                    <ScheduleDisplay schedule={schedule} courseColors={courseColors}/>
                </div>
            )}
        </div>
    );
}
