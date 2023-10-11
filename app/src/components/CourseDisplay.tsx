import { Course, Section } from "@scripts/soc";
import SectionDisplay from "@components/SectionDisplay";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Draggable } from "react-drag-and-drop";

interface Props {
    course: Course;
}

export default function CourseDisplay(props: Props) {
    const sectionDisplays = props.course.sections.map((section: Section) => (
        <SectionDisplay key={section.uid} section={section} draggable={true} />
    ));

    return (
        <div>
            {/* COURSE INFORMATION */}
            <Draggable type={"uid"} data={props.course.uid}>
                <div className="m-1">
                    <div className="w-full p-2 rounded-lg shadow-sm shadow-slate-400 dark:shadow-slate-950">
                        {/* Course Code & Name */}
                        <p className="text-slate-700 underline dark:text-white">
                            <b>{props.course.code}</b> {props.course.name}
                        </p>

                        {/* Description */}
                        <div className="mx-2">
                            <p className="text-slate-700 text-sm dark:text-slate-200">
                                {props.course.description}
                            </p>
                        </div>

                        {/* Additional Information */}
                        <div className={"text-center text-slate-700 text-xs dark:text-slate-200"}>
                            <i>({props.course.credits.display} Credits)</i>
                        </div>
                    </div>
                </div>
            </Draggable>

            {/* SECTIONS */}
            <div className="mx-3 my-1">{sectionDisplays}</div>
        </div>
    );
}
