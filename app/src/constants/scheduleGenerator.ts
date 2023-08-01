export const LIMIT_VALUES = [1E3, 5E4, 2E5, 1E6, 2E6, Infinity];

export const LIMITS: Array<[number, string]>
    = LIMIT_VALUES.map(val => [val, val == Infinity ? "∞" : val.toLocaleString()]);
