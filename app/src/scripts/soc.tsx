import {API_Course, API_Day, API_Days, API_Instructor, API_MeetTime, API_Section} from "@src/scripts/apiTypes";
import {ProgramMap, Term, TermMap} from "@src/constants/soc";

export class MeetTime {
    pBegin: number;
    pEnd: number;
    bldg: string;
    room: string;
    locationID: string;

    constructor(meetTimeJSON: API_MeetTime) {
        this.pBegin = MeetTime.parsePeriod(meetTimeJSON.meetPeriodBegin);
        this.pEnd = MeetTime.parsePeriod(meetTimeJSON.meetPeriodEnd);
        this.bldg = meetTimeJSON.meetBuilding;
        this.room = meetTimeJSON.meetRoom;
        this.locationID = meetTimeJSON.meetBldgCode;

        // Assume course is one section if either pBegin or pEnd is NaN
        if (isNaN(this.pBegin)) this.pBegin = this.pEnd;
        if (isNaN(this.pEnd)) this.pEnd = this.pBegin;
    }

    private static parsePeriod(period: string): number {
        if (period) {
            if (period.charAt(0) == 'E')
                return 11 + parseInt(period.substring(1));
            return parseInt(period);
        }
        return NaN;
    }

    static formatPeriod(p: number): string {
        return (p > 11 ? `E${p - 11}` : `${p}`);
    }

    conflictsWith(other: MeetTime): boolean {
        return (this.pBegin <= other.pEnd)
            && (other.pBegin <= this.pEnd);
    }
}

class Meetings extends Map<API_Day, MeetTime[]> {
    constructor() {
        super(
            API_Days.map((day: API_Day) => [day, []])
        );
    }
}

export class Section {
    number: number;
    courseCode: string; // Only for display
    displayName: string;
    instructors: string[];
    meetTimes: Meetings;
    finalExamDate: string;

    constructor(sectionJSON: API_Section, courseCode: string) {
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

export class Course {
    code: string;
    id: string;
    name: string;
    description: string;
    prerequisites: string;
    sections: Section[];

    constructor(courseJSON: API_Course) {
        this.code = courseJSON.code;
        this.id = courseJSON.courseId;
        this.name = courseJSON.name;
        this.description = courseJSON.description;
        this.prerequisites = courseJSON.prerequisites;
        this.sections = [];
    }
}

interface SOCInfo {
    termStr: string,
    term: Term,
    year: number
    program: string,
    scraped_at: Date
}

export class SOC {
    info: SOCInfo;
    courses: Course[];

    private constructor(info: SOCInfo, courses: Course[]) {
        this.info = info;
        this.courses = courses;
    }

    static async fetchSOC(): Promise<SOC> {
        /** @link https://create-react-app.dev/docs/code-splitting/ */
        const socJson: any = await import("@src/json/soc_scraped.json"),
            infoJson = socJson.info,
            coursesJson = socJson.courses;

        // Store the SOC information
        const info: SOCInfo = {
            termStr: infoJson.term,
            term: TermMap.get(infoJson.term.substring(3))!,
            year: parseInt(infoJson.term.charAt(0) + '0' + infoJson.term.substring(1, 3)),
            program: ProgramMap.get(infoJson.program)!,
            scraped_at: new Date(infoJson.scraped_at * 1000) // seconds --> milliseconds
        }
        console.log(`Using SOC for ${info.term} ${info.year}: ${info.program} [${info.termStr}] which was scraped on ${info.scraped_at.toLocaleString()}`);

        // Store the courses and their sections
        const courses: Course[] = [];
        coursesJson.forEach(function (courseJson: API_Course) {
            const courseCode: string = courseJson.code,
                course: Course = new Course(courseJson);
            courseJson.sections.forEach((sectionJson: API_Section) => {
                course.sections.push(new Section(sectionJson, courseCode));
            });

            courses.push(course); // Add the course to the courses array
        });

        return new SOC(info, courses); // Return the SOC
    }

    /**
     * Used to get a course from the SOC.
     * @param uid -- The course's index in the SOC.
     * @returns A promise for the course; null if it doesn't exist.
     */
    async getCourseByUID(uid: number): Promise<Course | null> {
        return this.courses.at(uid) ?? null;
    }

    /**
     * Used to get a UID from a course from the SOC.
     * @param course -- A `Course` object.
     * @returns A promise for the UID; null if it doesn't exist.
     */
    async getUIDByCourse(course: Course): Promise<number | null> {
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
    async getCourseBySection(section: Section): Promise<Course | null> {
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
    async getCourse(courseCode: string): Promise<Course | null> {
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
    async getSection(sectionNum: number): Promise<Section | null> {
        for (const c of this.courses) {
            for (const s of c.sections)
                if (s.number === sectionNum)
                    return s;
        }
        return null;
    }
}
