import { Section, SOC_Generic } from "@scripts/soc";
import { Term } from "@constants/soc";





export class Selection extends Array<Section> {
    static parseJSON(selectionJson: Section[]): Selection {
        return selectionJson.map((sectionJson: Section) => {
            return Section.parseJSON(sectionJson);
        });
    }
}

export class Schedule extends Array<Section> {
    term: Term;

    constructor(term: Term, sections: Section[] = []) {
        super();
        if (sections.length > 0) this.push(...sections);
        this.term = term;
    }

    fits(sectionToAdd: Section, gap: number): boolean {
        return this.every(
            (sec: Section) => !sectionToAdd.conflictsWith(sec, gap),
        );
    }
}

export class ScheduleGenerator {
    soc: SOC_Generic;
    selections: Selection[] = [];
    gap: number = 0;

    constructor(soc: SOC_Generic) {
        this.soc = soc;
    }

    loadSelections(selections: Selection[]) {
        this.selections = selections;
        console.log("Loaded selections", this.selections);
    }

    setGap(gap: number) {
        this.gap = gap;
    }

    *yieldSchedules(
        selectionInd: number = 0,
        currSchedule: Schedule = new Schedule(this.soc.info.term),
    ): Generator<Schedule, Schedule | undefined, undefined> {
        // Return if there are no selections
        if (this.selections.length < 1) {
            console.log("No selections, not generating");
            return undefined;
        }

        // Return if schedule is complete
        if (selectionInd == this.selections.length) return currSchedule;

        // Go through all the sections for the selection, and see if each could generate a new schedule
        const selection: Selection = this.selections[selectionInd];
        for (const sectionToAdd of selection) {
            if (currSchedule.fits(sectionToAdd, this.gap)) {
                // If it fits the current schedule, add it and keep going
                const gen = this.yieldSchedules(
                    selectionInd + 1,
                    new Schedule(currSchedule.term, [
                        ...currSchedule,
                        sectionToAdd,
                    ]),
                );

                let newSchedule: IteratorResult<Schedule>;
                do {
                    newSchedule = gen.next();
                    if (newSchedule.value) yield newSchedule.value;
                } while (!newSchedule.done);
            }
        }
    }
}
