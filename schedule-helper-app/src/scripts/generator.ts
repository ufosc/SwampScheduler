import {Section, SOC} from "./soc";

export class Generator {
    soc: SOC;
    // selections: Map<string, Section[]>;
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

    async loadExampleSelections() {
        this.selections = [];
        this.selections.push((await this.soc.getCourse("CDA3101")).sections);
        this.selections.push((await this.soc.getCourse("COP3530")).sections);
        this.selections.push((await this.soc.getCourse("ENC3246")).sections);
        this.selections.push((await this.soc.getCourse("MAP2302")).sections);
        this.selections.push((await this.soc.getCourse("MHF3202")).sections);
    }

    async generateSchedules(courseInd: number = 0, schedule: Section[] = [], schedules: Array<Section[]> = []) {
        // Return if schedule is complete
        if (courseInd == this.selections.length) {
            schedules.push(schedule);
            return schedules;
        }

        // Go through all the sections for the course, see if it fits the schedule so far
        let sections: Section[] = this.selections[courseInd];
        for (const tryToAdd of sections) {
            let fitsSchedule = true;
            for (const s of schedule)
                if (tryToAdd.conflictsWith(s)) {
                    fitsSchedule = false;
                    break;
                }

            if (fitsSchedule)
                await this.generateSchedules(courseInd + 1, [...schedule, tryToAdd], schedules);
        }
        return schedules;
    }
}