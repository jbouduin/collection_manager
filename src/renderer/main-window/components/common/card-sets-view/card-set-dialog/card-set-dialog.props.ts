import { Props } from "@blueprintjs/core";
import { CardSetViewmodel } from "../../../../viewmodels";

export interface CardSetDialogProps extends Props {
  cardSet: CardSetViewmodel;
  isOpen: boolean;
  onClose: () => void;
}
