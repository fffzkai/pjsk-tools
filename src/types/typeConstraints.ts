export type FixedLengthArray<T, N extends number, R extends unknown[] = []> = R["length"] extends N
    ? R
    : FixedLengthArray<T, N, [T, ...R]>;
