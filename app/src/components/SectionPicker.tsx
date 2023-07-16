import React, {ChangeEvent, useState} from "react";
import {Course, SOC_Generic, SOC_SearchType} from "@src/scripts/soc";
import MultipleCourseDisplay from "@src/components/MultipleCourseDisplay";

interface Props {
    soc: SOC_Generic
}

export default function SectionPicker(props: Props) {
    const [courses, setCourses] = useState<Course[]>([]);

    const doSearch = async (searchText: string) => {
        // Find and set matching courses
        let matchingCourses: Course[] = await props.soc.searchCourses(SOC_SearchType.COURSE_CODE, searchText);
        setCourses(matchingCourses);

        // Report courses found
        if (matchingCourses.length > 0)
            console.log("Courses matching search", matchingCourses);
        else
            console.log("No courses matching search found");
    }

    return (
        <div>
            <div>
                <select id="search_by"
                        className="bg-sky-500 hover:bg-sky-400 border border-blue-300 text-white text-sm rounded-lg p-2.5 mr-1"
                        defaultValue={"course_code"}>
                    <option value="course_code">Course Code</option>
                </select>

                <input id="search_text"
                       type="text"
                       className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 mb-0.5"
                       placeholder="Course Code"
                       onChange={(e: ChangeEvent<HTMLInputElement>) => doSearch(e.target.value)}
                />
            </div>

            {/*TODO: paginate courses, don't only show some*/}
            <MultipleCourseDisplay courses={courses.slice(0, 30)}></MultipleCourseDisplay>
        </div>
    );
}