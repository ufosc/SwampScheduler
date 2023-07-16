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

interface UIDSplit {
    courseUID: string,
    sectionUID: string | null
}

interface SOCInfo {
    termStr: string,
    term: Term,
    year: number
    program: string,
    scraped_at: Date
}

export enum SOC_SearchType {
    COURSE_CODE
}

export abstract class SOC_Generic {
    info: SOCInfo;
    courses: Course[];

    /* CONSTRUCT & INITIALIZE */

    protected constructor(info: SOCInfo, courses: Course[]) {
        this.info = info;
        this.courses = courses;
    }

    static async initialize(): Promise<SOC_Generic> {
        throw new Error("SOC initializer not implemented.");
    };

    /* UID */

    /**
     * Used to form a course/section's UID from the SOC.
     * @param courseInd -- The course/section's associated course index.
     * @param sectionInd -- The section's section index.
     * @returns The UID.
     */
    public static formUID(courseInd: number, sectionInd: number | undefined = undefined) {
        return sectionInd === undefined ? `${courseInd}` : `${courseInd}#${sectionInd}`;
    }

    /**
     * Used to split a course/section's UID.
     * @param uid -- The course/section's UID.
     * @returns The split UID.
     */
    public static splitUID(uid: string): UIDSplit {
        const sepInd = uid.indexOf('#');
        if (sepInd < 0) // No separator => Course
            return {courseUID: uid, sectionUID: null};

        // Separator => Section (in a Course)
        return {courseUID: uid.substring(0, sepInd), sectionUID: uid.substring(sepInd + 1)};
    }

    /**
     * Used to get a course/section from the SOC.
     * @param uid -- The course/section's UID.
     * @returns The course/section; null if there are no matches.
     */
    get(uid: string): Course | Section | null {
        const splitUID = SOC_Generic.splitUID(uid);
        if (!splitUID.sectionUID) // Resolve course
            return this.courses.at(parseInt(uid)) ?? null;
        else { // Resolve section
            const course = this.get(splitUID.courseUID);
            if (course instanceof Course)
                return course.sections.at(parseInt(splitUID.sectionUID)) ?? null; // Section resolve
            return null;
        }
    }

    /**
     * Used to get a course/section's UID from the SOC.
     * @param item -- A `Course` or `Section` object.
     * @returns The UID; null if the item doesn't exist.
     */
    getUID(item: Course | Section): string | null {
        for (const [courseInd, course] of this.courses.entries()) {
            if (item instanceof Course) { // Looking for a course
                if (course === item)
                    return SOC_Generic.formUID(courseInd);
            } else { // Looking for a section, look inside
                for (const [sectionInd, section] of course.sections.entries())
                    if (section === item)
                        return SOC_Generic.formUID(courseInd, sectionInd);
            }
        }
        return null;
    }


    /* UID UTILS */

    /**
     * Used to get the course that a section belongs to.
     * @param sectionUID -- A `Section`'s UID.
     * @returns The course; null if it doesn't exist.
     */
    getCourseBySectionUID(sectionUID: string): Course | null {
        const splitUID = SOC_Generic.splitUID(sectionUID),
            course = this.get(splitUID.courseUID);
        if (course instanceof Course)
            return course;
        return null;
    }

    /* SEARCHING */

    /**
     * Note: Search for courses by a search type and phrase.
     * @param searchBy -- The search type to use.
     * @param phrase -- Ex. COT3100 (not case-sensitive)
     * @returns A promise for all courses that match; null if one doesn't exist.
     */
    abstract searchCourses(searchBy: SOC_SearchType, phrase: string): Promise<Course[]>;
}

export class SOC_Scraped extends SOC_Generic {
    static async initialize(): Promise<SOC_Scraped> {
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
        coursesJson.forEach((courseJson: API_Course, courseInd: number) => {
            const courseCode: string = courseJson.code,
                course: Course = new Course(this.formUID(courseInd), courseJson);
            courseJson.sections.forEach((sectionJson: API_Section, sectionInd: number) => {
                course.sections.push(new Section(SOC_Generic.formUID(courseInd, sectionInd), sectionJson, courseCode));
            });

            courses.push(course); // Add the course to the courses array
        });

        return new SOC_Scraped(info, courses); // Return the SOC
    }

    /* SEARCHING & TESTING */

    searchCourses(searchBy: SOC_SearchType, phrase: string): Promise<Course[]> {
        if (searchBy == SOC_SearchType.COURSE_CODE) {
            if (!phrase) // Empty search term should not return all courses
                return Promise.resolve([]);

            const upperCode: string = phrase.toUpperCase();
            return Promise.resolve(
                this.courses.filter(c => c.code.includes(upperCode)) ?? null
            );
        }
        throw new Error("Unhandled search type.");
    }
}
