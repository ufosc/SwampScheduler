import {Term} from "@src/constants/soc";

export interface PeriodCount {
    regular: number,
    extra: number,
    all: number
}

const FallSpringCount: PeriodCount = {
    regular: 11,
    extra: 3,
    all: 14
}

const SummerCount: PeriodCount = {
    regular: 7,
    extra: 2,
    all: 9
}

export const PERIOD_COUNTS: Record<Term, PeriodCount> = {
    [Term.Fall]: FallSpringCount,
    [Term.Spring]: FallSpringCount,
    [Term.Summer]: SummerCount,
    [Term.Summer_A]: SummerCount,
    [Term.Summer_B]: SummerCount,
    [Term.Summer_C]: SummerCount
}
