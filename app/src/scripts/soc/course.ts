import {API_Course} from "@src/scripts/apiTypes";
import {Section} from "@src/scripts/soc";

export class Course {
    uid: string;
    code: string;
    id: string;
    name: string;
    description: string;
    prerequisites: string;
    sections: Section[];

    constructor(uid: string, courseJSON: API_Course) {
        this.uid = uid;
        this.code = courseJSON.code;
        this.id = courseJSON.courseId;
        this.name = courseJSON.name;
        this.description = courseJSON.description;
        this.prerequisites = courseJSON.prerequisites;
        this.sections = [];
    }
}