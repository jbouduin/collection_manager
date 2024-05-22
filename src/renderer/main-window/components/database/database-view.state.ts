import { CardSetDto } from "../../../../common/dto";
import { CardViewmodel } from "../../view-models/card.view-model";

export interface DatabaseViewState {
  selectedSets?: Array<CardSetDto>;
  selectedCards?: Array<CardViewmodel>;
}
