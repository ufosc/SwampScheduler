import {API_Days, API_Instructor, API_Section, API_Section_Type} from "@src/scripts/apiTypes";
import {Meetings, MeetTime} from "@src/scripts/soc";
import {Term} from "@src/constants/soc";

export class Section {
    uid: string;
    term: Term;
    type: API_Section_Type;
    number: number;
    courseCode: string; // Only for display TODO: consider using getCourse with UID
    displayName: string;
    instructors: string[];
    meetTimes: Meetings;
    finalExamDate: string;

    constructor(uid: string, term: Term, sectionJSON: API_Section, courseCode: string) {
        this.uid = uid;
        this.term = term;
        this.type = sectionJSON.sectWeb;
        this.number = sectionJSON.classNumber;
        this.courseCode = courseCode;
        this.displayName = sectionJSON.display;
        this.instructors = [];
        this.meetTimes = new Meetings();
        this.instructors = sectionJSON.instructors.map((i: API_Instructor) => i.name);
        for (const api_meetTime of sectionJSON.meetTimes) { // Go through meetTimes
            for (const day of api_meetTime.meetDays) // Add a MeetTime for each day with the same schedule
                this.meetTimes.get(day)!.push(new MeetTime(term, api_meetTime));
        }
        this.finalExamDate = sectionJSON.finalExam;
    }

    // Returns true if any of the meet times conflict
    conflictsWith(other: Section) {
        return API_Days.some(day =>
            this.meetTimes.get(day)!.some(mT1 =>
                other.meetTimes.get(day)!.some(mT2 =>
                    mT1.conflictsWith(mT2)
                )
            )
        );
    }
}
