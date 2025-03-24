import { Props } from "@blueprintjs/core";
import { SelectOption } from "../../../../../../../shared/components/utils";

export interface SelectSelectOptionProps<T extends string> extends Props {
  allItems: Array<SelectOption<T>>;
  label: string;
  onClearOptions: () => void;
  onOptionAdded: (option: SelectOption<T>) => void;
  onOptionRemoved: (option: SelectOption<T>) => void;
  selectedItems: Array<SelectOption<T>>;
}
