import { isEmpty, isNil, xor } from "lodash";

export function compareClassNameProp(prev: string, current: string): boolean {
  return (isNil(prev) && isNil(current)) ||
    (!isNil(prev) && !isNil(current)) ||
    isEmpty(xor(prev.split(" "), current.split(" ")));
}
