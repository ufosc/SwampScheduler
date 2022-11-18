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
    displayName: string;
    instructors: string[] = [];
    meetTimes: MeetTime[] = [];
    finalExamDate: string;

    constructor(sectionJSON) {
        this.number = sectionJSON['classNumber'];
        this.displayName = sectionJSON['display']
        for (let [, x] of sectionJSON['instructors'].entries())
            this.instructors.push(x['name']);
        for (let [, x] of sectionJSON['meetTimes'].entries())
            this.meetTimes.push(new MeetTime(x));
        this.finalExamDate = sectionJSON['finalExam'];
    }
}
