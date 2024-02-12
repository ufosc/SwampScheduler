//Importing React, necessary components, other class files, and any dependencies - used ChatGPT for proper syntax with the 'from ""'. 
import React, { useState, useEffect } from "react";
import {
  SOC_API,
  SOC_Generic,
  Course,
  Section
} from "@scripts/soc";
import {
  Selection,
  Schedule,
  ScheduleGenerator,
} 
from "@scripts/scheduleGenerator";
import { UF_SOC_API } from "@scripts/api";
import { API_Filters } from "@scripts/apiTypes";
import { arrayEquals, notEmpty, take } from "@scripts/utils";
import { LIMIT_VALUES, LIMITS } from "@constants/scheduleGenerator";
import SectionPicker from "@components/SectionPicker";
import MultipleSelectionDisplay from "@components/MultipleSelectionDisplay";
import MultipleScheduleDisplay from "@components/MultipleScheduleDisplay";


//getDefaultSelections: returns an array of schedules selected
//defaultProgram: default program value (this was already specified in the original code file)
const getDefaultSelections = () => [new Selection()];
const defaultProgram = "CWSP";

//function to build schedules and accomplish what the ScheduleBuilder class had to achieve before
const ScheduleBuilder = () => {
  //filters: API Filters fetched from the UF_SOC_API and are set to null at this time
  const [filters, setFilters] = useState<API_Filters | null>(null);
  //generator: generation of schedules through user usage of the website
  const [generator, setGenerator] = useState<ScheduleGenerator | null>(null);
  //soc: Schedule of Courses and is set to null to start off with (since no schedules yet built)
  const [soc, setSOCState] = useState<SOC_Generic | null>(null);
  //limit: maximum limit of schedules that can be generated; set initially to LIMIT_VALUES[0]
  const [limit, setLimit] = useState(LIMIT_VALUES[0]);
  //schedules: initial list of schedules with no schedules at the beginning
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  //pinnedSchedules: if a course wants to be pinned by the user, it will be added to the Schedule array
  const [pinnedSchedules, setPinnedSchedules] = useState<Schedule[]>([]);
  //showAddCourse: if a course needs to be added to a schedule, the AddCourse button would be implemented
  const [showAddCourse, setShowAddCourse] = useState(false);
   //selections: user-selected course sections
   const [selections, setSelections] = useState<Selection[]>(
    getDefaultSelections()
  );
  
  useEffect(() => {
    //fetch filters from UF_SOC_API and set the SOCState with the default program
    UF_SOC_API.fetchFilters().then(async (fetchedFilters) => {
      setFilters(fetchedFilters);
      await setSOCState(fetchedFilters.terms[0].CODE, defaultProgram);
    });
  }, []);
  //allows for loading selected courses into the schedule generator
  useEffect(() => {
    if (generator) {
      generator.loadSelections(
        selections.filter((sel: Selection) => sel.length > 0)
      );

      const newSchedules: Schedule[] = take(
        limit,
        generator.yieldSchedules()
      );
      setSchedules(newSchedules);
      //output whether the schedule was changed or not changed
      if (schedules === newSchedules) {
        console.log("Same schedules");
      } else {
        console.log("New schedules", newSchedules);
      }
    }
  }, [limit, selections, generator, schedules]);
  //reset the schedule building system
  const reset = () => {
    setSelections(getDefaultSelections());
    setSchedules([]);
    console.log("Reset Schedule Builder");
  };
  //initialize soc variable
  const setSOC = async (termStr: string, programStr: string) => {
    console.log(`Setting SOC to "${termStr}" for "${programStr}"`);
    const socInstance = await SOC_API.initialize({ termStr, programStr });
    setSOCState(socInstance);
  };
  //manages dropping (removing of) a course or schedule 
  const handleDrop = (ind: number, uid: string) => {
    if (soc) {
      const item: Section | Course | null = soc.get(uid);
      if (item) {
        let sectionsToTryAdd: Section[];
        if (item instanceof Course) sectionsToTryAdd = item.sections;
        else sectionsToTryAdd = [item];

        const sectionsToAdd: Section[] = sectionsToTryAdd.filter(
          (section) =>
            !selections.some((sel) => sel.includes(section))
        );
        newSelection(ind, sectionsToAdd);
      }
    }
  };
  
  //handles adding of new courses or schedules
  const newSelection = (ind: number = -1, sectionsToAdd: Section[] = []) => {
    if (ind !== -1) {
        const newSelections = selections.map((sel, i) => {
        if (i === ind) return [...sel, ...sectionsToAdd];
            return sel;
        });
    }
    else{
        setSelections([...selections, new Selection()]);
        return;
    }
    setSelections(newSelections);
  };
  //manages removal of a course selection
  const handleRemove = (sectionToRemove: Section) => {
    const newSelections = selections.map((sel) =>
      sel.filter((sec) => sec !== sectionToRemove)
    );
    setSelections(newSelections);
  };
  //manages deletion of a course selection
  const handleDeleteSelection = (ind: number) => {
    let newSelections = selections.filter((_sel, i) => i !== ind);
    if (newSelections.length === 0) 
        newSelections = getDefaultSelections();
    setSelections(newSelections);
  };
  //manages the pin status of a schedule
  const togglePin = (sch: Schedule) => {
    const pinned = pinnedSchedules;
    if (pinned.some((s) => arrayEquals(s, sch))) {
      setPinnedSchedules(pinned.filter((s) => !arrayEquals(s, sch)));
    } else {
      setPinnedSchedules([...pinned, sch]);
    }
  };
  //sample loading messages - used ChatGPT for assistance with this section
  return (
    <div className="min-h-screen flex flex-col h-screen p-3">
      <div className="flex">
        <p className="text-2xl text-slate-700 inline-block">
          🐊 Swamp Scheduler 📆
        </p>

        <div className="grow"></div>

        <select
          id="term"
          className="bg-sky-500 hover:bg-sky-400 border border-blue-300 text-white text-sm rounded-lg p-2.5 mr-1 text-center"
          defaultValue={soc?.info.termStr}
          onChange={(e) => setSOC(e.target.value, defaultProgram)}
          disabled={false}
        >
          {filters?.terms.map((t) => {
            const { term, year } = SOC_Generic.decodeTermString(t.CODE);
            return (
              <option value={t.CODE} key={t.CODE}>
                {term} {year}
              </option>
            );
          })}
        </select>

        <select
          id="limit"
          className="bg-sky-500 hover:bg-sky-400 border border-blue-300 text-white text-sm rounded-lg p-2.5 mr-1 text-center"
          defaultValue={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
          disabled={false}
        >
          {LIMITS.map(([num, str]) => (
            <option value={num} key={num}>
              Generate ≤{str}
            </option>
          ))}
        </select>
      </div>

      <hr className="my-1.5"></hr>

      <main className="flex flex-row overflow-y-hidden h-full p-1">
        <div className="overflow-y-auto w-full">
          <SectionPicker soc={soc} />
        </div>

        <div className="overflow-y-auto w-full p-1">
          <MultipleSelectionDisplay
            selections={selections}
            newSelection={newSelection}
            handleDrop={handleDrop}
            handleRemove={handleRemove}
            handleDeleteSelection={handleDeleteSelection}
            pinnedSchedules={togglePin}
            key={new Date().getTime()}
          />
        </div>

        <div className="overflow-y-auto w-full p-1">
          <MultipleScheduleDisplay
            schedules={schedules}
            pin={togglePin}
            key={new Date().getTime()}
          />
        </div>
      </main>
    </div>
  );
};
//export the function in other parts - the key purpose behind this task
export default ScheduleBuilder;
