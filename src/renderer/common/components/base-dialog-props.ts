import { Props } from "@blueprintjs/core";

export interface BaseDialogProps extends Props {
  isOpen: boolean;
  onDialogClose: () => void;
}
