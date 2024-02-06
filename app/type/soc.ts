export type SOC_Filter<CodeType> = {
  CODE: CodeType;
  DESC: string;
};

export type SOC_Filter_Term = SOC_Filter<string> & { SORT_TERM: number };

export type SOC_Filters = {
  categories: SOC_Filter<string>[];
  progLevels: SOC_Filter<string>[];
  terms: SOC_Filter_Term[];
  departments: SOC_Filter<number>[];
};

export type SOC_Instructor = {
  name: string;
};

export type DayOfWeek = "M" | "T" | "W" | "R" | "F" | "S";

export type SOC_MeetTime = {
  meetNo: number;
  meetDays: DayOfWeek[];
  meetTimeBegin: string;
  meetTimeEnd: string;
  meetPeriodBegin: string;
  meetPeriodEnd: string;
  meetBuilding: string;
  meetBldgCode: string;
  meetRoom: string;
};

export type SOC_Waitlist = {
  isEligible: string;
  cap: number;
  total: number;
};

export type SOC_Section = {
  number: string;
  classNumber: number;
  gradBasis: string;
  acadCareer: string;
  display: string;
  credits: number;
  credits_min: number;
  credits_max: number;
  note: string;
  dNote: string;
  genEd: string[];
  quest: string[];
  sectWeb: string;
  rotateTitle: string;
  deptCode: number;
  deptName: string;
  openSeats: null;
  courseFee: number;
  lateFlag: string;
  EEP: string;
  LMS: string;
  instructors: SOC_Instructor[];
  meetTimes: SOC_MeetTime[];
  addEligible: string;
  grWriting: string;
  finalExam: string;
  dropaddDeadline: string;
  pastDeadline: boolean;
  startDate: string;
  endDate: string;
  waitlist: SOC_Waitlist;
};

export type SOC_Course = {
  code: string;
  courseId: string;
  name: string;
  openSeats: null;
  termInd: string;
  description: string;
  prerequisites: string;
  sections: SOC_Section[];
};

export type SOC_Response = {
  COURSES: SOC_Course[];
  LASTCONTROLNUMBER: number;
  RETRIEVEDROWS: number;
  TOTALROWS: number;
};
