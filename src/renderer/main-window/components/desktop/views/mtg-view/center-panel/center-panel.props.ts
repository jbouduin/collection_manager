import { Props } from "@blueprintjs/core";
import { CardSetViewmodel, MtgCardListViewmodel } from "../../../../../viewmodels";


export interface CenterPanelProps extends Props {
  onCardsSelected: (cards?: Array<MtgCardListViewmodel>) => void;
  queryString: string;
  selectedSet: CardSetViewmodel;
}
