/* TERM */

export enum Term {
    Fall = 'Fall',
    Spring = 'Spring',
    Summer = 'Summer',
    Summer_A = 'Summer A',
    Summer_B = 'Summer B',
    Summer_C = 'Summer C',
}

const TermStringMap: Map<string, Term> = new Map([
    ['1', Term.Spring],
    ['5', Term.Summer],
    ['56W1', Term.Summer_A],
    ['56W2', Term.Summer_B],
    ['51', Term.Summer_C],
    ['8', Term.Fall]
]);

export function getTerm(termStr: string): Term {
    const val = TermStringMap.get(termStr);
    if (val === undefined)
        throw new Error(`Term string "${termStr}" does not map to a Program`);
    return val;
}

/* PROGRAM */

export enum Program {
    Campus = 'Campus + Web',
    Online = 'UF Online',
    Innovation = 'Innovation Academy'
}

const ProgramStringMap: Map<string, Program> = new Map([
    ['CWSP', Program.Campus],
    ['UFOL', Program.Online],
    ['IA', Program.Innovation]
]);

export function getProgram(programStr: string): Program {
    const val = ProgramStringMap.get(programStr);
    if (val === undefined)
        throw new Error(`Program string "${programStr}" does not map to a Program`);
    return val;
}

const ProgramStringReverseMap: Map<Program, string> = new Map(
    [...ProgramStringMap.entries()].map(([k, v]) => [v, k])
);

export function getProgramString(program: Program): string {
    const val = ProgramStringReverseMap.get(program);
    if (val === undefined)
        throw new Error(`Program "${program}" does not map to a string`);
    return val;
}

/* SEARCH */

export enum SearchBy {
    COURSE_CODE = 'Course Code',
    COURSE_TITLE = 'Course Title'
}

export const SearchBys = [
    SearchBy.COURSE_CODE,
    SearchBy.COURSE_TITLE
]

const SearchByStringMap = new Map([
    ['course-code', SearchBy.COURSE_CODE],
    ['course-title', SearchBy.COURSE_TITLE]
]);

export function getSearchBy(searchByStr: string): SearchBy {
    const val = SearchByStringMap.get(searchByStr);
    if (val === undefined)
        throw new Error(`SearchBy string "${searchByStr}" does not map to a SearchBy`);
    return val;
}

const SearchByStringReverseMap: Map<SearchBy, string> = new Map(
    [...SearchByStringMap.entries()].map(([k, v]) => [v, k])
);

export function getSearchByString(searchBy: SearchBy): string {
    const val = SearchByStringReverseMap.get(searchBy);
    if (val === undefined)
        throw new Error(`SearchBy "${searchBy} does not map to a string"`);
    return val;
}
