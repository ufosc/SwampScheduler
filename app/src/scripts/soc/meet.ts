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
    conflictsWith(other: MeetTime, gap: number): boolean {
        return (
            //this after other
            (this.periodBegin > other.periodBegin &&
                other.periodEnd + gap >= this.periodBegin) ||
            //this before other
            (this.periodBegin < other.periodBegin &&
                this.periodEnd + gap >= other.periodBegin) ||
            //this at other
            this.periodBegin == other.periodBegin
        );
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
