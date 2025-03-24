import { Props } from "@blueprintjs/core";
import { CardSetViewmodel } from "../../../../../../viewmodels";


export interface CardSetSelectProps extends Props {
  allCardSets: Array<CardSetViewmodel>;
  onClearOptions: () => void;
  onOptionAdded: (cardSet: CardSetViewmodel) => void;
  onOptionRemoved: (cardSetId: CardSetViewmodel) => void;
  selectedCardSets: Array<CardSetViewmodel>;
}
