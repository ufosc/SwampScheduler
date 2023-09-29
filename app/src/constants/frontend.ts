const sectionColors: string[] = [
    "bg-red-200",
    "bg-lime-200",
    "bg-cyan-200",
    "bg-fuchsia-200",
    "bg-amber-200",
    "bg-green-200",
    "bg-orange-200",
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
