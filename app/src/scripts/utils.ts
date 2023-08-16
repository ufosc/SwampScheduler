export function fetchCORS(input: RequestInfo | URL, init?: RequestInit) {
    // noinspection JSUnresolvedReference
    const { VITE_CORS_API_KEY: cors_api_key } = import.meta.env;
    if (!cors_api_key) throw new Error("CORS API key is missing");

    return fetch(`https://proxy.cors.sh/${input}`, {
        ...init,
        headers: {
            ...init?.headers,
            "x-cors-api-key": cors_api_key,
        },
    });
}

export function* take<T>(max: number, iterable: Iterable<T>): Generator<T> {
    for (const item of iterable) {
        if (max-- <= 0) return;
        yield item;
    }
}

interface Countable {
    length: number;
}

export function notEmpty<T extends Countable>(val: T): boolean {
    return val.length > 0;
}

export function notNullish<T>(value: T | null | undefined): value is T {
    return value !== null && value !== undefined;
}

export function arrayEquals<T>(a: Array<T>, b: Array<T>) {
    return a.length === b.length && a.every((val, ind) => val === b[ind]);
}

export class MinMax<T> {
    readonly min: T;
    readonly max: T;

    constructor(min: T, max: T) {
        this.min = min;
        this.max = max;
    }

    get display(): string {
        return this.min == this.max ? `${this.min}` : `${this.min}-${this.max}`;
    }
}
