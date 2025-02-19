import { Props } from "@blueprintjs/core";
import { CardSetViewmodel } from "../../../../viewmodels";

export interface MtgViewProps extends Props {
  onSynchronizeSet: (setCode: string) => void;
  onCardSetDialog: (cardSet: CardSetViewmodel) => void;
}
