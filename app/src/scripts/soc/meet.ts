import { API_Day, API_MeetTime } from "@scripts/apiTypes";
import { Term } from "@constants/soc";
import { PERIOD_COUNTS } from "@constants/schedule";

export class MeetTime {
    term: Term;
    periodBegin: number;
    periodEnd: number;
    timeBegin: string;
    timeEnd: string;
    bldg: string;
    room: string;
    isOnline: boolean;
    locationID: string | null;

    constructor(term: Term, meetTimeJSON: API_MeetTime, isOnline: boolean) {
        this.term = term;
        this.periodBegin = this.parsePeriod(meetTimeJSON.meetPeriodBegin);
        this.periodEnd = this.parsePeriod(meetTimeJSON.meetPeriodEnd);
        this.timeBegin = meetTimeJSON.meetTimeBegin;
        this.timeEnd = meetTimeJSON.meetTimeEnd;
        this.bldg = meetTimeJSON.meetBuilding;
        this.room = meetTimeJSON.meetRoom;
        this.isOnline = isOnline;
        this.locationID = meetTimeJSON.meetBldgCode;

        // Assume length is one period if either periodBegin or periodEnd is NaN
        if (isNaN(this.periodBegin)) this.periodBegin = this.periodEnd;
        if (isNaN(this.periodEnd)) this.periodEnd = this.periodBegin;

        // If the meeting is online, there is no location
        if (this.locationID == "WEB") this.locationID = null;
    }

    private parsePeriod(period: string): number {
        if (period) {
            if (period.charAt(0) == "E") {
                const periodCounts = PERIOD_COUNTS[this.term];
                return periodCounts.regular + parseInt(period.substring(1));
            }
            return parseInt(period);
        }
        return NaN;
    }

    static formatPeriod(p: number, term: Term) {
        const periodCounts = PERIOD_COUNTS[term];
        return p > periodCounts.regular
            ? `E${p - periodCounts.regular}`
            : `${p}`;
    }

    formatPeriods(): string {
        return this.periodBegin == this.periodEnd
            ? MeetTime.formatPeriod(this.periodBegin, this.term)
            : `${MeetTime.formatPeriod(
                  this.periodBegin,
                  this.term,
              )}-${MeetTime.formatPeriod(this.periodEnd, this.term)}`;
    }

    get location(): string | null {
        if (this.bldg && this.room) return `${this.bldg} ${this.room}`;
        if (this.isOnline) return "Online";
        return null;
    }

    // Returns true if the meet times conflict (overlap)
    conflictsWith(other: MeetTime): boolean {
        return (
            this.periodBegin <= other.periodEnd &&
            this.periodEnd >= other.periodBegin
        );
    }

    static parseMeetings = (meetingsJson: MeetingsJSON): Meetings => {
        let meetings = noMeetings();
        meetingsJson.M.forEach((meetTimeJson: MeetTimeJSON) => meetings.M.push(MeetTime.parseMeetTime(meetTimeJson)));
        meetingsJson.T.forEach((meetTimeJson: MeetTimeJSON) => meetings.T.push(MeetTime.parseMeetTime(meetTimeJson)));
        meetingsJson.W.forEach((meetTimeJson: MeetTimeJSON) => meetings.W.push(MeetTime.parseMeetTime(meetTimeJson)));
        meetingsJson.R.forEach((meetTimeJson: MeetTimeJSON) => meetings.R.push(MeetTime.parseMeetTime(meetTimeJson)));
        meetingsJson.F.forEach((meetTimeJson: MeetTimeJSON) => meetings.F.push(MeetTime.parseMeetTime(meetTimeJson)));
        meetingsJson.S.forEach((meetTimeJson: MeetTimeJSON) => meetings.S.push(MeetTime.parseMeetTime(meetTimeJson)));
        return meetings;
    }

    static parseMeetTime = (meetTimeJson: MeetTimeJSON): MeetTime => {
        let meetTime = new MeetTime(Term.Spring, this.emptyMeetTime(), false);
        meetTime.term = this.parseTermEnum(meetTimeJson.term);
        meetTime.periodBegin = meetTimeJson.periodBegin;
        meetTime.periodEnd = meetTimeJson.periodEnd;
        meetTime.timeBegin = meetTimeJson.timeBegin;
        meetTime.timeEnd = meetTimeJson.timeEnd;
        meetTime.bldg = meetTimeJson.bldg;
        meetTime.room = meetTimeJson.room;
        meetTime.isOnline = meetTimeJson.isOnline;
        meetTime.locationID = meetTimeJson.locationID;
        return meetTime;
    }

    static emptyMeetTime = () => {
        return {
            meetNo: 0,
            meetDays: [],
            meetTimeBegin: "",
            meetTimeEnd: "",
            meetPeriodBegin: "",
            meetPeriodEnd: "",
            meetBuilding: "",
            meetBldgCode: "",
            meetRoom: "",
        }
    }

    static parseTermEnum = (term: string): Term => {
        if (term == "Spring") {
            return Term.Spring;
        } else if (term == "Summer") {
            return Term.Summer;
        } else if (term == "Summer A") {
            return Term.Summer_A;
        } else if (term == "Summer B") {
            return Term.Summer_B;
        } else if (term == "Summer C") {
            return Term.Summer_C;
        } else if (term == "Fall") {
            return Term.Fall;
        }
        else {
            console.log(`Failed to find Term enum for ${term}, defaulting to 'Spring'`)
            return Term.Spring;
        }
    }

}

export type Meetings = Record<API_Day, MeetTime[]>;

export function noMeetings(): Meetings {
    return {
        [API_Day.Mon]: [],
        [API_Day.Tue]: [],
        [API_Day.Wed]: [],
        [API_Day.Thu]: [],
        [API_Day.Fri]: [],
        [API_Day.Sat]: [],
    };
}

// TODO(ccastillo): Remove serialization interfaces if unused, i.e. figure out if even need these interfaces
// Interfaces used for serialization
export interface MeetTimeJSON {
    term: string;
    periodBegin: number;
    periodEnd: number;
    timeBegin: string;
    timeEnd: string;
    bldg: string;
    room: string;
    isOnline: boolean;
    locationID: string | null;
}

export interface MeetingsJSON {
    M: MeetTimeJSON[];
    T: MeetTimeJSON[];
    W: MeetTimeJSON[];
    R: MeetTimeJSON[];
    F: MeetTimeJSON[];
    S: MeetTimeJSON[];
}