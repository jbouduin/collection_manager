import { Props } from "@blueprintjs/core";
import { SelectOption } from "../../../../../../../shared/components/utils";

export interface SelectSelectOptionProps<T extends string> extends Props {
  items: Array<SelectOption<T>>;
  label: string;
  onClearOptions: () => void;
  onOptionAdded: (option: T) => void;
  onOptionRemoved: (option: T) => void;
  selectedItems: Array<T>;
}
