export class MeetTime {
    periodBegin: number;
    periodEnd: number;
    bldg: string;
    room: string;

    constructor(meetTimeJSON) {
        this.periodBegin = meetTimeJSON['meetPeriodBegin'];
        this.periodEnd = meetTimeJSON['meetPeriodEnd'];
        this.bldg = meetTimeJSON['meetBuilding'];
        this.room = meetTimeJSON['meetRoom'];
    }

    conflictsWith(other: MeetTime) {
        return (this.periodBegin <= other.periodEnd)
            && (other.periodBegin <= this.periodEnd);
    }
}

export class Section {
    number: number;
    courseCode: string;
    displayName: string;
    instructors: string[] = [];
    meetTimes: Map<string, MeetTime[]> = new Map(
        [
            ["M", []],
            ["T", []],
            ["W", []],
            ["R", []],
            ["F", []],
            ["S", []]
        ]
    );
    finalExamDate: string;

    constructor(sectionJSON, courseCode) {
        this.number = sectionJSON['classNumber'];
        this.courseCode = courseCode;
        this.displayName = sectionJSON['display'];
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
    sections: Section[] = [];

    constructor(courseJSON) {
        this.code = courseJSON['code'];
        this.id = courseJSON['courseId'];
        this.name = courseJSON['name'];
        this.description = courseJSON['description'];
        this.prerequisites = courseJSON['prerequisites'];
    }
}

export class SOC {
    courses: Course[] = [];

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

    async getCourse(courseCode: string): Promise<Course> {
        for (const c of this.courses)
            if (c.code == courseCode)
                return c;
        return null;
    }

    async getSection(sectionNum: number): Promise<Section> {
        for (const c of this.courses) {
            for (const s of c.sections)
                if (s.number == sectionNum)
                    return s;
        }
        return null;
    }

    async getCourseSection(sectionNum: number, courseCode: string) {
        let c = await this.getCourse(courseCode);
        if (c != null) {
            for (const s of c.sections)
                if (s.number == sectionNum)
                    return s;
        }
        return null;
    }
}