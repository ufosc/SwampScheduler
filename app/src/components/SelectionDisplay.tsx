import React from "react";
import {Section} from "@src/scripts/soc";
import SectionDisplay from "@src/components/SectionDisplay";
// @ts-ignore
import {Droppable} from "react-drag-and-drop";
import {Selection} from "@src/scripts/generator";
import {GrClose} from "react-icons/gr"

interface Props {
    ind: number,
    selection: Selection,
    handleDrop: (ind: number, uid: string) => Promise<void>,
    handleRemove: (sectionToRemove: Section) => void,
    handleDeleteSelection: (ind: number) => void,
}

export default function SelectionDisplay(props: Props) {
    const doDrop = ({uid}: { uid: string }) => {
        props.handleDrop(props.ind, uid)
            .then();
    };

    const sectionDisplays = props.selection.map((section: Section) =>
        <SectionDisplay section={section} handleRemove={props.handleRemove}/>
    );

    return (
        <div>
            <Droppable types={['uid']} onDrop={doDrop}>
                <div className="p-2 mx-1 mb-2 rounded-lg shadow-sm shadow-slate-400">
                    <div className={"flex justify-between"}>
                        <u>Course {props.ind + 1}</u>
                        <button className={"mx-1"}
                                onClick={() => props.handleDeleteSelection(props.ind)}
                        >
                            <GrClose/>
                        </button>
                    </div>

                    <div>
                        {sectionDisplays}
                    </div>
                </div>
            </Droppable>
        </div>
    );
}
