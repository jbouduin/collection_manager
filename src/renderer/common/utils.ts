import { isEmpty, isNil, xor } from "lodash";
import { CardRarity } from "../../common/types";

/** Event handler that exposes the target element's value as a boolean. */
export function handleBooleanChange(handler: (checked: boolean) => void) {
  return (event: React.FormEvent<HTMLElement>) => handler((event.target as HTMLInputElement).checked);
}

/** Event handler that exposes the target element's value as a string. */
export function handleStringChange(handler: (value: string) => void) {
  return (event: React.FormEvent<HTMLElement>) => handler((event.target as HTMLInputElement).value);
}

/** Event handler that exposes the target element's value as an inferred generic type. */
export function handleValueChange<T>(handler: (value: T) => void) {
  return (event: React.FormEvent<HTMLElement>) => handler((event.target as HTMLInputElement).value as unknown as T);
}

/** Event handler that exposes the target element's value as a number. */
export function handleNumberChange(handler: (value: number) => void) {
  return handleStringChange((value) => handler(+value));
}

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

export function getRarityColorClassname(rarity: CardRarity) {
  switch (rarity) {
    case "uncommon":
      return "rarity-uncommon";
    case "rare":
      return "rarity-rare";
    case "mythic":
      return "rarity-mythic";
    default:
      return "";
  }
}

export function compareClassNameProp(prev: string, current: string): boolean {
  return (isNil(prev) && isNil(current)) ||
    (!isNil(prev) && !isNil(current)) ||
    isEmpty(xor(prev.split(" "), current.split(" ")));
}
