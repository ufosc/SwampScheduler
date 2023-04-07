export class MeetTime {
    pBegin: number;
    pEnd: number;
    bldg: string;
    room: string;
    locationID: string;

    constructor(meetTimeJSON) {
        // TODO: fix for E# periods
        this.pBegin = parseInt(meetTimeJSON['meetPeriodBegin']);
        this.pEnd = parseInt(meetTimeJSON['meetPeriodEnd']);
        this.bldg = meetTimeJSON['meetBuilding'];
        this.room = meetTimeJSON['meetRoom'];
        this.locationID = meetTimeJSON['meetBldgCode'];
    }

    conflictsWith(other: MeetTime) {
        return (this.pBegin <= other.pEnd)
            && (other.pBegin <= this.pEnd);
    }
}

class Meetings extends Map<string, MeetTime[]> {
    constructor() {
        super([
            ["M", []],
            ["T", []],
            ["W", []],
            ["R", []],
            ["F", []],
            ["S", []]
        ]);
    }
}

export class Section {
    number: number;
    courseCode: string; // Only for display
    displayName: string;
    instructors: string[];
    meetTimes: Meetings;
    finalExamDate: string;

    constructor(sectionJSON, courseCode) {
        this.number = sectionJSON['classNumber'];
        this.courseCode = courseCode;
        this.displayName = sectionJSON['display'];
        this.instructors = [];
        this.meetTimes = new Meetings();
        for (const [, x] of sectionJSON['instructors'].entries())
            this.instructors.push(x['name']);
        for (const [, x] of sectionJSON['meetTimes'].entries()) { // Go through meetTimes
            for (const day of x['meetDays']) // Add a MeetTime for each day with the same schedule
                this.meetTimes.get(day).push(new MeetTime(x));
        }
        this.finalExamDate = sectionJSON['finalExam'];
    }

    conflictsWith(other: Section) {
        // Make sure none of the meet times for each day don't conflict
        for (const day of this.meetTimes.keys()) {
            for (const mt1 of this.meetTimes.get(day))
                for (const mt2 of other.meetTimes.get(day))
                    if (mt1.conflictsWith(mt2))
                        return true;
        }
        return false;
    }
}

export class Course {
    code: string;
    id: string;
    name: string;
    description: string;
    prerequisites: string;
    sections: Section[];

    constructor(courseJSON) {
        this.code = courseJSON['code'];
        this.id = courseJSON['courseId'];
        this.name = courseJSON['name'];
        this.description = courseJSON['description'];
        this.prerequisites = courseJSON['prerequisites'];
        this.sections = [];
    }
}

export class SOC {
    courses: Course[];

    private constructor(courses) {
        this.courses = courses;
    }

    static async fetchSOC(url: string): Promise<SOC> {
        let resp = await fetch(url), // Fetch the file
            socJson = await resp.json(); // Parse the json file

        // Store the courses and their sections
        let courses: Course[] = [];
        socJson.forEach(function (courseJson) {
            let courseCode: string = courseJson['code'],
                course: Course = new Course(courseJson);
            courseJson['sections'].forEach((sectionJson) => {
                course.sections.push(new Section(sectionJson, courseCode));
            });

            courses.push(course); // Add the course to the courses array
        });

        return new SOC(courses); // Return the SOC
    }

    /**
     * Used to get a course from the SOC.
     * @param uid -- The course's index in the SOC.
     * @returns A promise for the course; null if it doesn't exist.
     */
    async getCourseByUID(uid: number): Promise<Course> {
        return this.courses.at(uid) ?? null;
    }

    /**
     * Used to get a UID from a course from the SOC.
     * @param course -- A `Course` object.
     * @returns A promise for the UID; null if it doesn't exist.
     */
    async getUIDByCourse(course: Course): Promise<number> {
        for (const [key, item] of this.courses.entries())
            if (item === course)
                return key;
        return null;
    }

    /**
     * Used to get the course that a section belongs to.
     * @param section -- A `Section` object
     * @returns A promise for the course; null if it doesn't exist.
     */
    async getCourseBySection(section: Section): Promise<Course> {
        for (const c of this.courses) {
            for (const s of c.sections)
                if (s === section)
                    return c;
        }
        return null;
    }


    /* SEARCHING & TESTING */

    /**
     * Note: Course codes are NOT unique! This should only be used for searching & testing purposes.
     * @param courseCode -- Ex. COT3100 (not case-sensitive)
     * @returns A promise for the first matching course; null if one doesn't exist.
     */
    async getCourse(courseCode: string): Promise<Course> {
        const upperCode: string = courseCode.toUpperCase();

        for (const c of this.courses)
            if (c.code === upperCode)
                return c;
        return null;
    }

    /**
     * Note: Course codes are NOT unique! This should only be used for searching & testing purposes.
     * @param courseCodeSubstr -- Ex. COT or COT3 or 3100  (not case-sensitive)
     * @returns A promise for an array of the matching courses (will return an empty array if "" is the substring given).
     */
    async getCoursesMatching(courseCodeSubstr: string): Promise<Course[]> {
        const upperSubstr: string = courseCodeSubstr.toUpperCase();
        if (upperSubstr === "")
            return [];

        let matchingCourses: Course[] = [];
        for (const c of this.courses)
            if (c.code.includes(upperSubstr))
                matchingCourses.push(c)
        return matchingCourses;
    }

    /**
     * Note: Section numbers are NOT unique! This should only be used for searching & testing purposes.
     * @param sectionNum -- Ex. 11490
     * @returns A promise for the first matching section; null if one doesn't exist.
     */
    async getSection(sectionNum: number): Promise<Section> {
        for (const c of this.courses) {
            for (const s of c.sections)
                if (s.number === sectionNum)
                    return s;
        }
        return null;
    }
}
