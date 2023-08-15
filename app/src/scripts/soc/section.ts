import {
    API_Days,
    API_Instructor,
    API_Section,
    API_Section_Type,
} from "@scripts/apiTypes";
import { Meetings, MeetTime } from "@scripts/soc";
import { Term } from "@constants/soc";
import { MinMax } from "@scripts/utils.ts";

export class Section {
    uid: string;
    term: Term;
    type: API_Section_Type;
    number: number;
    courseCode: string; // Only for display TODO: consider using getCourse with UID
    displayName: string;
    instructors: string[];
    credits: MinMax<number>;
    meetings: Meetings;
    finalExamDate: string;

    constructor(
        uid: string,
        term: Term,
        sectionJSON: API_Section,
        courseCode: string,
    ) {
        this.uid = uid;
        this.term = term;
        this.type = sectionJSON.sectWeb;
        this.number = sectionJSON.classNumber;
        this.courseCode = courseCode;
        this.displayName = sectionJSON.display;
        this.instructors = [];
        this.credits = new MinMax<number>(
            sectionJSON.credits_min,
            sectionJSON.credits_max,
        );
        this.meetings = new Meetings(); // Must be initialized
        this.instructors = sectionJSON.instructors.map(
            (i: API_Instructor) => i.name,
        );
        this.finalExamDate = sectionJSON.finalExam;

        // TODO: maybe put this in Meetings?
        // Add every meeting
        for (const api_meetTime of sectionJSON.meetTimes) {
            // Go through meetTimes
            for (const day of api_meetTime.meetDays) // Add a MeetTime for each day with the same schedule
                this.meetings.get(day)!.push(new MeetTime(term, api_meetTime));
        }

        // Fallback displayName to something identifiable
        if (this.displayName == "Departmentally Controlled")
            this.displayName = courseCode;
    }

    // Returns true if any of the meet times conflict
    conflictsWith(other: Section): boolean {
        return API_Days.some((day) =>
            this.meetings
                .get(day)!
                .some((mT1) =>
                    other.meetings
                        .get(day)!
                        .some((mT2) => mT1.conflictsWith(mT2)),
                ),
        );
    }

    isOnline(): boolean {
        return (
            this.type == API_Section_Type.Online ||
            this.type == API_Section_Type.MostlyOnline
        );
    }
}
