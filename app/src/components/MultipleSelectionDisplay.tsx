import { Selection } from "@scripts/scheduleGenerator";
import { Section } from "@scripts/soc";
import SelectionDisplay from "@components/SelectionDisplay";

interface Props {
    selections: Selection[];
    hoveredCourseId: string | null;
    handleDrop: (ind: number, uid: string) => Promise<void>;
    newSelection: () => void;
    handleRemove: (sectionToRemove: Section) => void;
    handleDeleteSelection: (ind: number) => void;
}

export default function MultipleSelectionDisplay(props: Props) {
    // TODO: don't use index?
    const selectionDisplays = props.selections.map((sel, i) => (
        <SelectionDisplay
            ind={i}
            selection={sel}
            handleDrop={props.handleDrop}
            handleRemove={props.handleRemove}
            handleDeleteSelection={props.handleDeleteSelection}
            hoveredCourseId={props.hoveredCourseId}
        />
    ));

    return (
        <div>
            <div>{selectionDisplays}</div>
            {/* TODO: reconsider all these classes */}
            <button
                className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded w-full"
                onClick={() => {
                    props.newSelection();
                }}
            >
                Add Course
            </button>
        </div>
    );
}
