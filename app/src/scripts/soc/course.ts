import { API_Course } from "@scripts/apiTypes";
import { Section } from "@scripts/soc";
import { Term } from "@constants/soc";
import { MinMax } from "@scripts/utils.ts";

export class Course {
    uid: string;
    term: Term;
    code: string;
    id: string;
    name: string;
    description: string;
    sections: Section[];

    constructor(uid: string, term: Term, courseJSON: API_Course) {
        this.uid = uid;
        this.term = term;
        this.code = courseJSON.code;
        this.id = courseJSON.courseId;
        this.name = courseJSON.name;
        this.description = courseJSON.description;
        this.sections = [];
    }

    get credits(): MinMax<number> {
        const credits = this.sections.map((s) => s.credits),
            minimums = credits.map((c) => c.min),
            maximums = credits.map((c) => c.max);

        return new MinMax<number>(Math.min(...minimums), Math.max(...maximums));
    }
}
