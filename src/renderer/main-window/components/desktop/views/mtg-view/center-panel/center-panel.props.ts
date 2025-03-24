import { Props } from "@blueprintjs/core";
import { CardSetTreeViewmodel, MtgCardListViewmodel } from "../../../../../viewmodels";


export interface CenterPanelProps extends Props {
  onCardsSelected: (cards?: Array<MtgCardListViewmodel>) => void;
  queryString: string;
  selectedSet: CardSetTreeViewmodel;
}
