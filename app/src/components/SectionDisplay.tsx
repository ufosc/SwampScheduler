import React, { useState, ReactNode } from "react";
import { Course, Section } from "@scripts/soc";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Draggable } from "react-drag-and-drop";
import { GrClose, GrInfo, GrLock } from "react-icons/gr";
import { CampusMap } from "@scripts/api";
import { API_Days } from "@scripts/apiTypes.ts";
import { notNullish } from "@scripts/utils.ts";
import { Box, Fade, Modal } from '@mui/material';

interface Props {
    section: Section;
    draggable?: boolean;
    handleRemove?: (sectionToRemove: Section) => void;
    getCourseBySectionUID?: (sectionUID: string) => Course | null;
}

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    border: '1px solid #000',
    boxShadow: 24,
    p: 4,
  };

export default function SectionDisplay({
    section,
    draggable = false,
    handleRemove,
    getCourseBySectionUID,
}: Props) {
    const [modalOpen, setModalOpen] = useState(false);
    const handleOpenModal = () => setModalOpen(true);
    const handleCloseModal = () => setModalOpen(false);

    const getModalContent = (): ReactNode => {
        if (getCourseBySectionUID) {
            let course = getCourseBySectionUID(section.uid);
            if (course) {
                return <div>
                    <p className="text-slate-700 underline">
                        <b>{course.code}</b> {course.name}
                    </p>
                    <div className="mx-2">
                    <p className="text-slate-700 text-sm">
                        {course.description}
                    </p>
                    </div>
                </div>
            }
        }
        return <p>Error retrieving course data.</p>;
    }

    const allTimes: React.JSX.Element[] = API_Days.map((day, d) =>
        section.meetings[day].length > 0 ? (
            <div className="mx-1" key={d}>
                <b>{day}:</b>{" "}
                {section.meetings[day].map((mT, m) => (
                    <span key={m}>
                        {CampusMap.createLink(
                            mT.locationID,
                            `${mT.location}`,
                            <>{mT.formatPeriods()}</>,
                        )}{" "}
                    </span>
                ))}
            </div>
        ) : null,
    ).filter(notNullish);

    return (
        <Draggable
            className={"inline-block"}
            type={"uid"}
            data={section.uid}
            enabled={draggable}
        >
            <div className="m-1 text-sm">
                {" "}
                {/* SECTION */}
                <div className="w-full p-2 rounded-lg shadow-sm shadow-slate-400">
                    <div className={"text-slate-600 flex justify-between"}>
                        <div className={"flex items-center gap-1"}>
                            <b>{section.number}</b>
                            <span className={"text-xs align-middle"}>
                                ({section.credits.display} Credits)
                            </span>
                        </div>
                        <button
                            className={"mx-1"}
                            hidden={!handleRemove}
                            onClick={() =>
                                handleRemove && handleRemove(section)
                            }
                        >
                            <GrClose />
                        </button>
                    </div>

                    <div className={"text-slate-400"}>
                        <p className={"flex items-center gap-1"}>
                            {section.deptControlled && (
                                <abbr title={"Departmentally Controlled"}>
                                    <GrLock />
                                </abbr>
                            )}
                            {section.displayName}
                        </p>
                        <p>
                            <i>{section.instructors.join(", ")}</i>
                        </p>
                        <div className={"flex flex-row justify-around"}>
                            {allTimes}
                            <div>
                            <button className={"mx-1 small"}
                                hidden={!getCourseBySectionUID}
                                onClick={handleOpenModal}>
                                <GrInfo />
                            </button>
                            <Modal open={modalOpen} onClose={handleCloseModal} closeAfterTransition>
                                <Fade in={modalOpen}>
                                    <Box sx={style} className="rounded">
                                        <div>{getModalContent()}</div>
                                    </Box>
                                </Fade>
                            </Modal>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Draggable>
    );
}
