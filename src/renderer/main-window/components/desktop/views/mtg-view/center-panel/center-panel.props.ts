import { Props } from "@blueprintjs/core";
import { CardSetViewmodel, MtgCardListViewmodel } from "../../../../../viewmodels";


export interface CenterPanelProps extends Props {
  queryString: string;
  selectedSets: Array<CardSetViewmodel>;
  onCardsSelected(cards?: Array<MtgCardListViewmodel>): void;
}
