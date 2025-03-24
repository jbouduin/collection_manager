import { CardSetTreeViewmodel, MtgCardListViewmodel } from "../../../../viewmodels";

export interface MtgViewState {
  selectedCards: Array<MtgCardListViewmodel>;
  selectedSet: CardSetTreeViewmodel;
  queryString: string;
}
