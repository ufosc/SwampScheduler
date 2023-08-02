export const LIMIT_VALUES = [1e3, 5e4, 2e5, 1e6, 2e6, Infinity];

export const LIMITS: Array<[number, string]> = LIMIT_VALUES.map((val) => [
    val,
    val == Infinity ? "∞" : val.toLocaleString(),
]);
