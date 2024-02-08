const sectionColors: string[] = [
    "bg-red-200 dark:bg-red-500",
    "bg-lime-200 dark:bg-lime-500",
    "bg-cyan-200 dark:bg-cyan-500",
    "bg-fuchsia-200 dark:bg-fuchsia-500",
    "bg-amber-200 dark:bg-amber-500",
    "bg-green-200 dark:bg-green-500",
    "bg-orange-200 dark:bg-orange-500",
];

export function getSectionColor(sectionInd: number): string {
    return sectionColors[sectionInd % sectionColors.length];
}

const SearchByStringExampleMap = new Map([
    ["course-code", "MAS3114"],
    ["course-title", "Linear Algebra"],
    ["instructor", "Huang"],
]);

export function getSearchByStringExample(searchByStr: string): string {
    const val = SearchByStringExampleMap.get(searchByStr);
    if (val === undefined)
        throw new Error(
            `SearchBy string "${searchByStr}" does not map to an example`,
        );
    return val;
}
