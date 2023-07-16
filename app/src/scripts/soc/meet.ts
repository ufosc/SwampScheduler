import {API_Day, API_Days, API_MeetTime} from "@src/scripts/apiTypes";

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

export class Meetings extends Map<API_Day, MeetTime[]> {
    constructor() {
        super(
            API_Days.map((day: API_Day) => [day, []])
        );
    }
}
