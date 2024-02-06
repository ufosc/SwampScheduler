import Container from "@components/Container";
import { FaBan, FaBuilding, FaDisplay, FaThumbtack } from "react-icons/fa6";
import { Section_Info } from "@components/Course";
import moment from "moment";

interface SectionProps {
  sectionInfo: Section_Info;
}

export default function Section({
  sectionInfo: { number, modality, meetings, instructors },
}: SectionProps) {
  return (
    <Container className={"border-spacing-1 border-gray-400"}>
      <div className={"flex justify-between text-sm font-bold"}>
        <div>#{number}</div>
        <div className={"flex gap-4 items-center text-xs"}>
          <FaThumbtack
            className={"opacity-60 hover:opacity-80 active:opacity-100"}
          />
          <FaBan className={"opacity-60 hover:opacity-80 active:opacity-100"} />
        </div>
      </div>
      <div className={"flex flex-row text-xs items-start justify-between"}>
        <div className={"flex gap-1 items-center"}>
          <FaBuilding /> {modality}
        </div>
        <div className={""}>
          {meetings.map(({ daysOfWeek, startTime, endTime }, i) => (
            <div className={"flex"} key={i}>
              <div className={"w-4"}>{daysOfWeek.join("")}</div>
              <div
                className={""}
              >{`${startTime.format("LT")}-${endTime.format("LT")}`}</div>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}
