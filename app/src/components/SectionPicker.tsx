import { useState } from "react";
import { Course, SOC_API, SOC_Generic } from "@scripts/soc";
import MultipleCourseDisplay from "@components/MultipleCourseDisplay";
import { getSearchBy, getSearchByString, SearchBys } from "@constants/soc";
import { useQuery } from "react-query";
import { getSearchByStringExample } from "@constants/frontend";

//Search Type Drop Down
//Searh Bar
//Search Button

interface Props {
    soc: SOC_Generic;
}

export default function SectionPicker(props: Props) {
    const [searchByString, setSearchByString] = useState<string>(
        getSearchByString(SearchBys[0]),
    );
    const [searchText, setSearchText] = useState("");
    const searchBy = getSearchBy(searchByString);

    /* https://github.com/apollographql/apollo-client/issues/9583 */
    const [abortRef, setAbortRef] = useState(new AbortController());
    const {
        isFetching,
        data: courses,
        refetch: fetchCourses,
    } = useQuery<Course[]>({
        initialData: [],
        queryFn: () => {
            return props.soc instanceof SOC_API
                ? props.soc.fetchSearchCourses(searchBy, searchText, abortRef)
                : props.soc.searchCourses(searchBy, searchText);
        },
        enabled: false,
        notifyOnChangeProps: ["data", "isFetching"], // Must re-render on isFetching change to update cursor
        refetchOnWindowFocus: false, // Turned off to prevent queries while debugging using console
        refetchOnReconnect: false, // Not needed
    });

    let coursesToDisplay = <p>Loading...</p>;
    if (!isFetching)
        coursesToDisplay = <MultipleCourseDisplay courses={courses ?? []} />;

    return (
        <div
            className={"h-full"}
            style={{ cursor: isFetching ? "progress" : "default" }}
        >
            <div>
                <select
                    id={"search-by"}
                    className={
                        "bg-sky-500 hover:bg-sky-400 border border-blue-300 text-white text-sm rounded-lg p-2.5 mr-1"
                    }
                    defaultValue={searchByString}
                    onChange={(e) => setSearchByString(e.target.value)}
                >
                    {SearchBys.map((st) => {
                        const stString = getSearchByString(st);
                        return (
                            <option key={stString} value={stString}>
                                {st}
                            </option>
                        );
                    })}
                </select>

                <input
                    id={"search-text"}
                    type={"text"}
                    className={
                        "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 mb-0.5"
                    }
                    placeholder={getSearchByStringExample(searchByString)}
                    value={searchText}
                    onChange={(e) => {
                        if (isFetching) {
                            console.log('Aborting fetching courses')
                            abortRef.abort('input text being changed');
                            setAbortRef(new AbortController());
                        }
                        setSearchText(e.target.value)
                    }}
                    autoComplete={"off"}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            if (isFetching) {
                                console.log('Aborting fetching courses')
                                abortRef.abort('enter key being pressed');
                                setAbortRef(new AbortController());
                            } else {
                                fetchCourses();
                            }   
                        }
                    }}
                />

                <button
                    onClick={() => {
                        if (isFetching) {
                            console.log('Aborting fetching courses')
                            abortRef.abort('search button being clicked');
                            setAbortRef(new AbortController());
                        } else {
                            fetchCourses();
                        }   
                    }}
                    className="bg-sky-500 hover:bg-sky-400 border border-blue-300 text-white text-sm rounded-lg p-2.5 ml-1"
                >
                    Search
                </button>
            </div>

            {coursesToDisplay}
        </div>
    );
}
