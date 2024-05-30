import { CardSetViewmodel, CardViewmodel } from "../../../viewmodels";

export interface DatabaseViewState {
  selectedSets?: Array<CardSetViewmodel>;
  selectedCards?: Array<CardViewmodel>;
}
