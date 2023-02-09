import {Section, SOC} from "./soc";

export class Generator {
    soc: SOC;
    selections: Array<Section[]>;

    private constructor(soc: SOC) {
        this.soc = soc;
    }

    static async createGenerator(soc_url: string) {
        let soc = await SOC.fetchSOC(soc_url);
        return new Generator(soc);
    }

    loadSelections(selections: Array<Section[]>) {
        this.selections = selections;
    }

    async generateSchedules(selectionInd: number = 0, currSchedule: Section[] = [], schedules: Array<Section[]> = []) {
        // Return if schedule is complete
        if (selectionInd == this.selections.length) {
            schedules.push(currSchedule);
            return schedules;
        }

        // Go through all the sections for the selection, see if it fits the schedule so far
        let sections: Section[] = this.selections[selectionInd];
        for (const tryToAdd of sections) {
            let fitsSchedule = true;
            for (const s of currSchedule)
                if (tryToAdd.conflictsWith(s)) {
                    fitsSchedule = false;
                    break;
                }

            if (fitsSchedule)
                await this.generateSchedules(selectionInd + 1, [...currSchedule, tryToAdd], schedules);
        }
        return schedules;
    }
}