import { CardSetViewmodel, MtgCardListViewmodel } from "../../../../viewmodels";

export interface DatabaseViewState {
  selectedSets?: Array<CardSetViewmodel>;
  selectedCards?: Array<MtgCardListViewmodel>;
}
