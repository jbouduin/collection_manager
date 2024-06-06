import { Props } from "@blueprintjs/core";

export interface FooterViewProps extends Props {
  hasChanges: boolean;
  onSave: () => void;
  onCancel: () => void;
}
