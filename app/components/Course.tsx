"use client";
import Container from "@components/Container";
import {
  FaBan,
  FaBuilding,
  FaChevronDown,
  FaChevronUp,
  FaDisplay,
  FaPalette,
  FaTrash,
} from "react-icons/fa6";
import { useState } from "react";
import Section from "@components/Section";
import { SOC_Section } from "@type/soc";
import moment, { Moment } from "moment";

interface Instructor_Info {
  firstName: string;
  lastName: string;
  rating: number | null;
}

interface Meeting_Info {
  daysOfWeek: ("M" | "T" | "W" | "R" | "F" | "S")[];
  startTime: Moment;
  endTime: Moment;
}

export interface Section_Info {
  number: number;
  modality: "In-person" | "Hybrid" | "Online 80%" | "Online 100%";
  meetings: Meeting_Info[];
  instructors: Instructor_Info[];
}

const inPerson: Section_Info = {
  number: 14533,
  modality: "In-person",
  meetings: [
    {
      daysOfWeek: ["M", "W", "F"],
      startTime: moment("11:45 AM", "LT"),
      endTime: moment("12:35 PM", "LT"),
    },
    {
      daysOfWeek: ["T", "W"],
      startTime: moment("3:00 PM", "LT"),
      endTime: moment("4:55 PM", "LT"),
    },
  ],
  instructors: [
    {
      firstName: "Shu",
      lastName: "Huang",
      rating: 4.5,
    },
    {
      firstName: "Hemaho",
      lastName: "Beaugard Taboe",
      rating: null,
    },
    {
      firstName: "Chirantha",
      lastName: "Piyamal Bandara",
      rating: null,
    },
  ],
};

const online: Section_Info = {
  number: 14550,
  modality: "Online 100%",
  meetings: [],
  instructors: [
    {
      firstName: "Shu",
      lastName: "Huang",
      rating: 4.5,
    },
    {
      firstName: "David",
      lastName: "Shi",
      rating: null,
    },
    {
      firstName: "Dixi",
      lastName: "Wang",
      rating: null,
    },
  ],
};

const sections: Section_Info[] = [inPerson, online];

export default function Course() {
  const [instructorOpen, setInstructorOpen] = useState<boolean>(true);

  return (
    <div className={"bg-purple-800 p-1 flex flex-col gap-1 rounded"}>
      <div>
        <div className={"flex justify-between px-1 items-center"}>
          <div className={"font-bold"}>MAS 3114</div>
          <div className={"text-xs"}>
            <div className={"flex gap-4 items-center"}>
              <FaPalette
                className={"opacity-60 hover:opacity-80 active:opacity-100"}
              />
              <FaChevronDown
                className={"opacity-60 hover:opacity-80 active:opacity-100"}
              />
              <FaTrash
                className={"opacity-60 hover:opacity-80 active:opacity-100"}
              />
            </div>
          </div>
        </div>
        <div className={"flex justify-between px-1 h-6 items-center"}>
          <div className={"text-sm text-nowrap mr-4"}>
            Computational Linear Algebra
          </div>
          <div className={"flex gap-4 items-center text-sm"}>
            <FaBuilding />
            <FaDisplay />
          </div>
        </div>
        <div className={"flex justify-between px-1 h-6 items-center"}>
          <div className={"flex gap-1 items-center text-sm mr-4"}>
            <div className={"text-nowrap"}>Course Rating:</div>
            <div>4.5 / 5</div>
          </div>
          <div className={"text-sm"}>4 Credits</div>
        </div>
      </div>

      <Container className={"rounded"}>
        <div>
          <div className={"font-semibold"}>Prerequisites</div>
          <div className={"text-[9px]"}>
            {/* DESCRIPTION */}
            MAC 2312, MAC 2512 or MAC 3473 with a minimum grade of C and
            experience with a scientific programming language.
          </div>
        </div>
      </Container>
      <Container className={"rounded"}>
        <div>
          <div className={"flex justify-between"}>
            <div className={"flex items-center gap-2"}>
              <div className={"font-semibold"}>Shu-Jen Huang</div>
              <div className={"text-xs"}>4.5 / 5</div>
              <div className={"text-xs"}>(+2)</div>
            </div>
            <div className={"flex gap-4 items-center text-xs mx-1"}>
              <FaChevronUp
                className={
                  "opacity-60 hover:opacity-80 transition-all transform active:opacity-100"
                }
                style={{
                  transform: instructorOpen ? "rotate(180deg)" : "rotate(0)",
                }}
                onClick={() => setInstructorOpen(!instructorOpen)}
              />
              <FaBan
                className={"opacity-60 hover:opacity-80 active:opacity-100"}
              />
            </div>
          </div>
          <div className={"flex flex-col gap-0.5 rounded overflow-clip my-0.5"}>
            {sections.map((sec) => (
              <Section key={sec.number} sectionInfo={sec} />
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
