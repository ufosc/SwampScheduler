import { useState } from "react";
import { Schedule } from "@scripts/scheduleGenerator";
import ScheduleDisplay from "@components/ScheduleDisplay";

const NUM_PER_PAGE = 25;

interface Props {
    schedules: Schedule[];
    numPerPage?: number;
    pin: (sch: Schedule) => void;
}

export default function MultipleScheduleDisplay(props: Props) {
    const [numPages, setNumPages] = useState(1);

    const maxSchedulesToShow = (props.numPerPage ?? NUM_PER_PAGE) * numPages;
    const schedulesToShow = props.schedules.slice(0, maxSchedulesToShow);
    return (
        <div>
            <p className={"text-center"}>
                <b>
                    <u>{props.schedules.length.toLocaleString()}</u> Schedules
                    Generated
                </b>
            </p>

            {schedulesToShow.map((schedule: Schedule, s) => (
                <div key={s}>
                    <u>Schedule #{s + 1}</u>
                    <ScheduleDisplay schedule={schedule} pin={props.pin}/>
                </div>
            ))}

            {maxSchedulesToShow < props.schedules.length && (
                <div className={"text-center"}>
                    <button
                        className={
                            "bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-3 rounded inline-flex items-center"
                        }
                        onClick={() => setNumPages(numPages + 1)}
                    >
                        View More
                    </button>
                </div>
            )}
        </div>
    );
}
