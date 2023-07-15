export enum Term {
    Fall = 'Fall',
    Spring = 'Spring',
    Summer = 'Summer',
    Summer_A = 'Summer A',
    Summer_B = 'Summer B',
    Summer_C = 'Summer C',
}

export const TermMap: Map<string, Term> = new Map([
    ['1', Term.Spring],
    ['5', Term.Summer],
    ['56W1', Term.Summer_A],
    ['56W2', Term.Summer_B],
    ['51', Term.Summer_C],
    ['8', Term.Fall]
]);

export enum Program {
    Campus = 'Campus + Web',
    Online = 'UF Online',
    Innovation = 'Innovation Academy'
}

export const ProgramMap: Map<string, Program> = new Map([
    ['CWSP', Program.Campus],
    ['UFOL', Program.Online],
    ['IA', Program.Innovation]
]);
