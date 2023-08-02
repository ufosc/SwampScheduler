import { API_Course } from "@scripts/apiTypes";
import { Section } from "@scripts/soc";
import { Term } from "@constants/soc";

export class Course {
    uid: string;
    term: Term;
    code: string;
    id: string;
    name: string;
    description: string;
    prerequisites: string;
    sections: Section[];

    constructor(uid: string, term: Term, courseJSON: API_Course) {
        this.uid = uid;
        this.term = term;
        this.code = courseJSON.code;
        this.id = courseJSON.courseId;
        this.name = courseJSON.name;
        this.description = courseJSON.description;
        this.prerequisites = courseJSON.prerequisites;
        this.sections = [];
    }
}
