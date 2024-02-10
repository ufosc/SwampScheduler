import { useState, useRef } from "react";
import { Schedule } from "@scripts/scheduleGenerator";
import ScheduleDisplay from "@components/ScheduleDisplay";

const NUM_PER_PAGE = 25;

interface Props {
    schedules: Schedule[];
    numPerPage?: number;
}

export default function MultipleScheduleDisplay(props: Props) {
    const [numPages, setNumPages] = useState(1);

    const scrollAnchorRef = useRef<HTMLDivElement>(null);
    const scrollToTop = () => {
        scrollAnchorRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const maxSchedulesToShow = (props.numPerPage ?? NUM_PER_PAGE) * numPages;
    const schedulesToShow = props.schedules.slice(0, maxSchedulesToShow);
    return ( 
        <div ref={scrollAnchorRef}>  
            <p className={"text-center"}>
                <b>
                    <u>{props.schedules.length.toLocaleString()}</u> Schedules
                    Generated
                </b>
            </p>

            {schedulesToShow.map((schedule: Schedule, s) => (
                <div key={s}>
                    <u>Schedule #{s + 1}</u>
                    <ScheduleDisplay schedule={schedule} />
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

            <button onClick={scrollToTop} className="bg-sky-500 hover:bg-sky-400 border border-blue-300 text-white text-sm rounded-lg p-1.5 mr-1 text-center mt-1.5 mb-1.5">
                Scroll to top
            </button>

        </div>
    );
}
