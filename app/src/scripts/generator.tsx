import {Section, SOC} from "./soc";

export class Selection extends Array<Section> {
}

export class Schedule extends Array<Section> {
    constructor(sections: Section[] = []) {
        super();
        if (sections.length > 0)
            this.push(...sections);
    }

    fits(sectionToAdd: Section): boolean {
        return this.every(
            (sec: Section) => !sectionToAdd.conflictsWith(sec)
        );
    }
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

    async generateSchedules(selectionInd: number = 0, currSchedule: Schedule = new Schedule(), schedules: Schedule[] = []): Promise<Schedule[]> {
        // Return if schedule is complete (or given no selections)
        if (selectionInd == this.selections.length) {
            if (this.selections.length > 0) // Add "schedule" if selections were given (prevents returning an empty schedule when no selections are given)
                schedules.push(currSchedule);
            return schedules;
        }

        // Go through all the sections for the selection, and see if each could generate a new schedule
        let selection: Selection = this.selections[selectionInd];
        for (const sectionToAdd of selection) {
            if (currSchedule.fits(sectionToAdd)) // If it fits the current schedule, add it and keep going
                await this.generateSchedules(selectionInd + 1, new Schedule([...currSchedule, sectionToAdd]), schedules);
        }
        return schedules;
    }
}