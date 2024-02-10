import { Section } from "@scripts/soc";
import SectionDisplay from "@components/SectionDisplay";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Droppable } from "react-drag-and-drop";
import { Selection } from "@scripts/scheduleGenerator";
import { GrClose } from "react-icons/gr";

interface Props {
    ind: number;
    selection: Selection;
    hoveredElementSectionUid: string | null;
    hoveredElementCourseId: string | null;
    handleDrop: (ind: number, uid: string) => Promise<void>;
    handleRemove: (sectionToRemove: Section) => void;
    handleDeleteSelection: (ind: number) => void;
    storeHoveredElementSection: (courseID: string | null) => void;
    forgetHoveredElementSection: () => void;
    storeHoveredElementCourse: (courseID: string) => void;
    forgetHoveredElementCourse: () => void;
}

export default function SelectionDisplay(props: Props) {
    const doDrop = ({ uid }: { uid: string }) => {
        props.handleDrop(props.ind, uid).then();
    };

    const sectionDisplays = props.selection.map((section: Section, idx) => (
        <SectionDisplay
            draggable={false}
            key={idx}
            section={section}
            handleRemove={props.handleRemove}
            hoveredElementSectionUid={props.hoveredElementSectionUid}
            hoveredElementCourseId={props.hoveredElementCourseId}
            storeHoveredElementSection={props.storeHoveredElementSection}
            forgetHoveredElementSection={props.forgetHoveredElementSection}
            storeHoveredElementCourse={props.storeHoveredElementCourse}
            forgetHoveredElementCourse={props.forgetHoveredElementCourse}
        />
    ));

    return (
        <div>
            <Droppable types={["uid"]} onDrop={doDrop}>
                <div className="p-2 mx-1 mb-2 rounded-lg shadow-sm shadow-slate-400">
                    <div className={"flex justify-between"}>
                        <u>Course {props.ind + 1}</u>
                        <button
                            className={"mx-1"}
                            onClick={() =>
                                props.handleDeleteSelection(props.ind)
                            }
                        >
                            <GrClose />
                        </button>
                    </div>

                    <div>{sectionDisplays}</div>
                </div>
            </Droppable>
        </div>
    );
}
