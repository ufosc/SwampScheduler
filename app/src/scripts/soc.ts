enum Day {
    M, T, W, R, F, S
}

enum Period {
    P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, E1, E2, E3
}

// The set of periods in a week through the Day x Period Cartesian product
export class MeetTime {
    day: Day;
    periodBegin: Period;
    periodEnd: Period;

    constructor(day: Day, periodBegin: Period, periodEnd: Period) {
        this.day = day;
        this.periodBegin = periodBegin;
        this.periodEnd = periodEnd;
    }

    conflictsWith(other: MeetTime): boolean {
        return this.day == other.day
            && this.periodBegin <= other.periodEnd
            && other.periodBegin <= this.periodEnd;
    }
}

export class Section {
    number: number;
    courseCode: string; // Only for display
    displayName: string;
    instructors: string[];
    meetTimes: MeetTime[];
    finalExamDate: string;

    constructor(sectionJSON, courseCode) {
        this.number = sectionJSON['classNumber'];
        this.courseCode = courseCode;
        this.displayName = sectionJSON['display'];

        // Parse instructors 
        this.instructors = [];
        for (const [, instructorJSON] of sectionJSON['instructors'].entries())
            this.instructors.push(instructorJSON['name']);

        // Parse meeting times
        this.meetTimes = [];
        for (const [, meetTimeJSON] of sectionJSON['meetTimes'].entries()) {
            // Add a MeetTime for each day 
            let periodBegin = meetTimeJSON['meetPeriodBegin'];
            let periodEnd = meetTimeJSON['meetPeriodEnd'];

            if (!periodBegin.startsWith['E']) periodBegin = 'P' + periodBegin;
            if (!periodEnd.startsWith['E']) periodEnd = 'P' + periodEnd;

            this.meetTimes.push(new MeetTime(
                Day[meetTimeJSON['day'] as keyof typeof Day],
                Period[periodBegin as keyof typeof Period],
                Period[periodEnd as keyof typeof Period]
            ))

        }
        this.finalExamDate = sectionJSON['finalExam'];
    }

    conflictsWith(other: Section): boolean {
        return this.conflictsWithTimes(other.meetTimes);
    }

    conflictsWithTimes(times: MeetTime[]): boolean {
        for (const meetTime of this.meetTimes)
            for (const otherTime of times)
                if (meetTime.conflictsWith(otherTime)) return true; 
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


    /* TESTING */

    /**
     * Note: Course codes are NOT unique! This should only be used for testing purposes.
     * @param courseCode -- Ex. COT3100 (not case-sensitive)
     * @returns A promise for the first matching course; null if one doesn't exist.
     */
    async getCourse(courseCode: string): Promise<Course> {
        for (const c of this.courses)
            if (c.code === courseCode.toUpperCase())
                return c;
        return null;
    }

    /**
     * Note: Section numbers are NOT unique! This should only be used for testing purposes.
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
