import {API_Days, API_Instructor, API_Section} from "@src/scripts/apiTypes";
import {Meetings, MeetTime} from "@src/scripts/soc";

export class Section {
    uid: string;
    number: number;
    courseCode: string; // Only for display
    displayName: string;
    instructors: string[];
    meetTimes: Meetings;
    finalExamDate: string;

    constructor(uid: string, sectionJSON: API_Section, courseCode: string) {
        this.uid = uid;
        this.number = sectionJSON.classNumber;
        this.courseCode = courseCode;
        this.displayName = sectionJSON.display;
        this.instructors = [];
        this.meetTimes = new Meetings();
        this.instructors = sectionJSON.instructors.map((i: API_Instructor) => i.name);
        for (const api_meetTime of sectionJSON.meetTimes) { // Go through meetTimes
            for (const day of api_meetTime.meetDays) // Add a MeetTime for each day with the same schedule
                this.meetTimes.get(day)!.push(new MeetTime(api_meetTime));
        }
        this.finalExamDate = sectionJSON.finalExam;
    }

    conflictsWith(other: Section) {
        // Make sure none of the meet times for each day don't conflict
        return API_Days.some(day =>
            this.meetTimes.get(day)!.some(mT1 =>
                other.meetTimes.get(day)!.some(mT2 =>
                    mT1.conflictsWith(mT2)
                )
            )
        );
    }
}
