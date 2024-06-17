import { Props } from "@blueprintjs/core";
import { CardSetViewmodel } from "../../../../viewmodels";

export interface DatabaseViewProps extends Props {
  onSynchronizeSet: (setCode: string) => void;
  onCardSetDialog: (cardSet: CardSetViewmodel) => void;
}
