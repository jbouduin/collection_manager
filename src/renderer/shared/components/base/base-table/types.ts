import { BaseLookupResult } from "./base-lookup-result";

export type CellLookup<T, U extends BaseLookupResult> = (rowIndex: number, valueCallBack: (row: T) => U) => U;
export type SortCallback<T> = (comparator: (a: T, b: T) => number) => void;
