import { Course, Section, SOC_Generic } from "@scripts/soc";
import SectionDisplay from "@components/SectionDisplay";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Draggable } from "react-drag-and-drop";

interface Props {
    course: Course;
    storeHoveredElementSection: (courseID: string | null) => void;
    forgetHoveredElementSection: () => void;
    storeHoveredElementCourse: (courseID: string) => void;
    forgetHoveredElementCourse: () => void;
}

export default function CourseDisplay(props: Props) {
    const sectionDisplays = props.course.sections.map((section: Section) => (
        <SectionDisplay
        key={section.uid}
        section={section}
        draggable={true}
        // pass in null hover status because this should never be highlighted when something else is hovered
        hoveredElementSectionUid={null}
        hoveredElementCourseId={null}
        handleRemove={function (): void {throw new Error("Course should not be able to be removed from course display.");}}
        storeHoveredElementSection={props.storeHoveredElementSection}
        forgetHoveredElementSection={props.forgetHoveredElementSection}
        // Pass in empty functions because hovering a section on the left shouldn't affect the "course hover" status
        storeHoveredElementCourse={(_uid: string): void => {}}
        forgetHoveredElementCourse={(): void => {}}
        />));

    return (
        <div>
            {/* COURSE INFORMATION */}
            <Draggable type={"uid"} data={props.course.uid}>
                <div className="m-1">
                    <div className="w-full p-2 rounded-lg shadow-sm shadow-slate-400" onMouseEnter={() => props.storeHoveredElementCourse(SOC_Generic.getCourseID(props.course.uid))} onMouseLeave={() => props.forgetHoveredElementCourse()}>
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
