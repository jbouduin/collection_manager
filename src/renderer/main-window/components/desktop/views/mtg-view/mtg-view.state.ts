import { CardSetViewmodel, MtgCardListViewmodel } from "../../../../viewmodels";

export interface MtgViewState {
  selectedCards: Array<MtgCardListViewmodel>;
  selectedSet: CardSetViewmodel;
  queryString: string;
}
