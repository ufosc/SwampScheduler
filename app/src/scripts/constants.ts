const sectionColors: string[] = [
    'bg-red-200',
    'bg-lime-200',
    'bg-cyan-200',
    'bg-fuchsia-200',
    'bg-amber-200',
    'bg-green-200',
    'bg-orange-200'
];

export function getSectionColor(sectionInd: number): string {
    return sectionColors[sectionInd % sectionColors.length];
}