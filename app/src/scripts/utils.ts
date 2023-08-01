import config from "@src/json/config.json";

const {REACT_APP_CORS_API_KEY} = process.env;

export function fetchCORS(input: RequestInfo | URL, init?: RequestInit) {
    const cors_api_key: string = process.env["NODE_ENV"] == "development" ?
        config.DEV_CORS_API_KEY :
        REACT_APP_CORS_API_KEY as string;
    if (!cors_api_key)
        throw new Error("CORS API key is missing");

    return fetch(`https://proxy.cors.sh/${input}`,
        {
            ...init,
            headers: {
                ...init?.headers,
                'x-cors-api-key': cors_api_key
            }
        }
    );
}

export function* take<T>(max: number, iterable: Iterable<T>): Generator<T> {
    for (const item of iterable) {
        if (max-- <= 0) return;
        yield item;
    }
}

export function filterNotEmpty<T>(arr: Array<T[]>): Array<T[]> {
    return arr.filter(val => val.length > 0);
}

export function arrayEquals<T>(a: Array<T>, b: Array<T>) {
    return a.length === b.length &&
        a.every((val, ind) => val === b[ind]);
}
