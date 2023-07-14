import {Schedule} from "../scripts/generator";
import ScheduleDisplay from "./ScheduleDisplay";
import React from "react";

interface Props {
    schedules: Schedule[]
}

export default function MultipleScheduleDisplay(props: Props) {
    return (
        <div>
            <p className={"text-center"}>
                <b><u>{props.schedules.length}</u> Schedules Generated</b>
            </p>

            {props.schedules.map((schedule: Schedule, i: number) =>
                <div>
                    <u>Schedule #{i + 1}</u>
                    <ScheduleDisplay schedule={schedule}/>
                </div>
            )}
        </div>
    );
}
