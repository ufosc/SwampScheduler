export class MeetTime {
    days: string[];
    periodBegin: number;
    periodEnd: number;
    bldg: string;
    room: string;

    constructor(meetTimeJSON) {
        this.days = meetTimeJSON['meetDays'];
        this.periodBegin = meetTimeJSON['meetPeriodBegin'];
        this.periodEnd = meetTimeJSON['meetPeriodEnd'];
        this.bldg = meetTimeJSON['meetBuilding'];
        this.room = meetTimeJSON['meetRoom'];
    }
}

export class Section {
    number: number;
    courseCode: string;
    displayName: string;
    instructors: string[] = [];
    meetTimes: MeetTime[] = [];
    finalExamDate: string;

    constructor(sectionJSON, courseCode) {
        this.number = sectionJSON['classNumber'];
        this.courseCode = courseCode;
        this.displayName = sectionJSON['display'];
        for (let [, x] of sectionJSON['instructors'].entries())
            this.instructors.push(x['name']);
        for (let [, x] of sectionJSON['meetTimes'].entries())
            this.meetTimes.push(new MeetTime(x));
        this.finalExamDate = sectionJSON['finalExam'];
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