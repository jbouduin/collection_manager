import { CardSetViewmodel, MtgCardListViewmodel } from "../../../../viewmodels";

export interface MtgViewState {
  selectedSets?: Array<CardSetViewmodel>;
  selectedCards?: Array<MtgCardListViewmodel>;
  queryString?: string;
}
