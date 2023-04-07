import {Section, SOC} from "./soc";

export class Selection extends Array<Section> {
}

export class Schedule extends Array<Section> {
}

export class Generator {
    soc: SOC;
    selections: Selection[] = [];

    constructor(soc: SOC) {
        this.soc = soc;
    }

    loadSelections(selections: Selection[]) {
        this.selections = selections;
        console.log("Loaded selections", this.selections);
    }

    async generateSchedules(selectionInd: number = 0, currSchedule: Schedule = [], schedules: Schedule[] = []): Promise<Schedule[]> {
        // Return if schedule is complete (or given no selections)
        if (selectionInd == this.selections.length) {
            if (this.selections.length > 0) // Add "schedule" if selections were given (prevents returning an empty schedule when no selections are given)
                schedules.push(currSchedule);
            return schedules;
        }

        // Go through all the sections for the selection, see if it fits the schedule so far
        let selection: Selection = this.selections[selectionInd];
        for (const sectionToAdd of selection) {
            let fitsSchedule = true;
            for (const sec of currSchedule)
                if (sectionToAdd.conflictsWith(sec)) {
                    fitsSchedule = false;
                    break;
                }

            if (fitsSchedule)
                await this.generateSchedules(selectionInd + 1, [...currSchedule, sectionToAdd], schedules);
        }
        return schedules;
    }
}