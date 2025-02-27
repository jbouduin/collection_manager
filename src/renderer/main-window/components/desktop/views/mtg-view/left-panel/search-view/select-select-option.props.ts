import { Props } from "@blueprintjs/core";
import { SelectOption } from "../../../../../../../common/utils";

export interface SelectSelectOptionProps<T extends string> extends Props {
  items: Array<SelectOption<T>>;
  label: string;
  selectedItems: Array<T>;

  onOptionAdded: (option: T) => void;
  onOptionRemoved: (option: T) => void;
  onClearOptions: () => void;
}
