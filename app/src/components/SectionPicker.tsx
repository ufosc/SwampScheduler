import { useState } from "react";
import { Course, SOC_API, SOC_Generic } from "@scripts/soc";
import MultipleCourseDisplay from "@components/MultipleCourseDisplay";
import { getSearchBy, getSearchByString, SearchBys } from "@constants/soc";
import { useQuery } from "react-query";
import { getSearchByStringExample } from "@constants/frontend";

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
        // queryKey: [props.searchText], // Re-fetch when searchText is updated
        queryFn: () => {
            setAbortRef(new AbortController());
            return props.soc instanceof SOC_API
                ? props.soc.fetchSearchCourses(searchBy, searchText, abortRef)
                : props.soc.searchCourses(searchBy, searchText);
        },
        enabled: false,
        // enabled: !!props.searchText, // Prevents query when searchText is empty
        notifyOnChangeProps: ["data", "isFetching"], // Must re-render on isFetching change to update cursor
        refetchOnWindowFocus: false, // Turned off to prevent queries while debugging using console
        refetchOnReconnect: false, // Not needed
    });
    // console.log(isFetching ? "Fetching courses..." : "Not fetching.");

    const searchCourse = () => {
        fetchCourses();
    };

    // TODO: make it clearer when not fetching and there are no search results
    // const displayCourses = (
    //     isFetching
    //         ? props.soc instanceof SOC_API
    //             ? props.soc.searchCourses(searchBy, props.searchText)
    //             : []
    //         : courses ?? []
    // ).slice(0, 30);

    const renderCourses = () => {
        if (isFetching) {
            return <p>Loading...</p>;
        }

        if (courses) {
            return <MultipleCourseDisplay courses={courses.slice(0, 30)} />;
        }

        return [];
    };

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
                    onChange={(e) => setSearchText(e.target.value)}
                    autoComplete={"off"}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            searchCourse();
                        }
                    }}
                />

                <button
                    onClick={searchCourse}
                    className="bg-sky-500 hover:bg-sky-400 border border-blue-300 text-white text-sm rounded-lg p-2.5 mr-1"
                >
                    Search
                </button>
            </div>

            {renderCourses()}
        </div>
    );
}
