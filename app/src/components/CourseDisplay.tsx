import { Course, Section } from "@scripts/soc";
import SectionDisplay from "@components/SectionDisplay";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Draggable } from "react-drag-and-drop";

interface Props {
    course: Course;
    handleHoverCourse: (courseCode: string) => void;
    handleUnhoverCourse: () => void;
}

export default function CourseDisplay(props: Props) {
    const sectionDisplays = props.course.sections.map((section: Section) => (
        <SectionDisplay key={section.uid} section={section} draggable={true} hoveredCourse={null} handleRemove={function (): void {
            throw new Error("Course should not be able to be removed from course display.");
        } }/> // pass in null hover status because this should never be highlighted when something else is hovered
    ));

    return (
        <div>
            {/* COURSE INFORMATION */}
            <Draggable type={"uid"} data={props.course.uid}>
                <div className="m-1">
                    <div className="w-full p-2 rounded-lg shadow-sm shadow-slate-400" onMouseEnter={() => props.handleHoverCourse(props.course.code)} onMouseLeave={() => props.handleUnhoverCourse()}>
                        {/* Course Code & Name */}
                        <p className="text-slate-700 underline">
                            <b>{props.course.code}</b> {props.course.name}
                        </p>

                        {/* Description */}
                        <div className="mx-2">
                            <p className="text-slate-700 text-sm">
                                {props.course.description}
                            </p>
                        </div>

                        {/* Additional Information */}
                        <div className={"text-center text-slate-700 text-xs"}>
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
