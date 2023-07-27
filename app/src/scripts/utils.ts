export function filterNotEmpty<T>(arr: Array<T[]>): Array<T[]> {
    return arr.filter(val => val.length > 0);
}

export function arrayEquals<T>(a: Array<T>, b: Array<T>) {
    return a.length === b.length &&
        a.every((val, ind) => val === b[ind]);
}
