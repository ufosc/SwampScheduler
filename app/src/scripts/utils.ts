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

export function filterNotEmpty<T>(arr: Array<T[]>): Array<T[]> {
    return arr.filter((val) => val.length > 0);
}

export function arrayEquals<T>(a: Array<T>, b: Array<T>) {
    return a.length === b.length && a.every((val, ind) => val === b[ind]);
}
