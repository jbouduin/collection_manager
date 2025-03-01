import { Props } from "@blueprintjs/core";
import { CardSetViewmodel } from "../../../../../../viewmodels";


export interface CardSetSelectProps extends Props {
  cardSets: Array<CardSetViewmodel>;
  selectedCardSets: Array<string>;

  onOptionAdded: (cardSetId: string) => void;
  onOptionRemoved: (cardSetId: string) => void;
  onClearOptions: () => void;
}
