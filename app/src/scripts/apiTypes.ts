export enum API_Day {
    Mon = 'M',
    Tue = 'T',
    Wed = 'W',
    Thu = 'R',
    Fri = 'F',
    Sat = 'S'
}

export const API_Days: API_Day[] = [
    API_Day.Mon,
    API_Day.Tue,
    API_Day.Wed,
    API_Day.Thu,
    API_Day.Fri,
    API_Day.Sat
]

export interface API_MeetTime {
    meetNo: number,
    meetDays: API_Day[],
    meetTimeBegin: string,
    meetTimeEnd: string,
    meetPeriodBegin: string,
    meetPeriodEnd: string,
    meetBuilding: string,
    meetBldgCode: string,
    meetRoom: string
}

export interface API_Instructor {
    name: string
}

export interface API_Waitlist {
    isEligible: string,
    cap: number,
    total: number
}

export enum API_Section_Type {
    PrimarilyClassroom = "PC",
    Hybrid = "HB",
    MostlyOnline = "PD",
    Online = "AD"
}

export interface API_Section {
    number: string,
    classNumber: number,
    gradBasis: number,
    acadCareer: number,
    display: string,
    credits: number,
    credits_min: number,
    credits_max: number,
    note: string,
    dNote: string,
    genEd: string[],
    quest: string[],
    sectWeb: API_Section_Type,
    rotateTitle: string,
    deptCode: number,
    deptName: string,
    openSeats: number,
    courseFee: number,
    lateFlag: string,
    EEP: string,
    LMS: string,
    instructors: API_Instructor[],
    meetTimes: API_MeetTime[],
    addEligible: string,
    grWriting: string,
    finalExam: string,
    dropaddDeadline: string,
    pastDeadline: boolean,
    startDate: string,
    endDate: string,
    waitList: API_Waitlist
}

export interface API_Course {
    code: string,
    courseId: string,
    name: string,
    openSeats: number,
    termInd: string,
    description: string,
    prerequisites: string,
    sections: API_Section[]
}

export interface API_Filter<C> {
    CODE: C,
    DESC: string,
}

export interface API_Filter_Sortable extends API_Filter<string> {
    SORT_TERM: number
}

export interface API_Filters {
    categories: API_Filter<string>[],
    progLevels: API_Filter<string>[],
    terms: API_Filter_Sortable[],
    departments: API_Filter<number>[]
}
