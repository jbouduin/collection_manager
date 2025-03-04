export type SelectOption<T> = { value: T; label: string };

export function displayValueRecordToSelectOptions<T extends string>(record: Record<T, string>): Array<SelectOption<T>> {
  const result = new Array<SelectOption<T>>();
  Object.keys(record).forEach((key: T) => {
    if (record[key]) {
      result.push({ value: key, label: record[key] });
    }
  });
  return result;
}
