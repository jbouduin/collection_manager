import { Props } from "@blueprintjs/core";

export interface CardSetDialogProps extends Props {
  cardSetId: string;
  cardSetSvg: string;
  isOpen: boolean;
  onClose: () => void;
}
