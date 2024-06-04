import { Props } from "@blueprintjs/core";

import { CardSetViewmodel, CardViewmodel } from "../../../viewmodels";


export interface CardsTableViewProps extends Props {
  selectedSets: Array<CardSetViewmodel>;
  onCardsSelected(cards?: Array<CardViewmodel>): void;
}
