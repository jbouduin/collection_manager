enum ETimespanUnit {
  day,
  week,
  month,
  year
}

export type TimespanUnit = keyof typeof ETimespanUnit;

export const TimespanUnitDisplayValue = new Map<TimespanUnit, string>([
  ["day", "Day(s)"],
  ["week", "Week(s)"],
  ["month", "Month(s)"],
  ["year", "Year(s)"]
]);
