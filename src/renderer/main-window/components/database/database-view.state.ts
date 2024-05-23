import { DtoCardSet } from "../../../../common/dto";
import { CardViewmodel } from "../../view-models/card.view-model";

export interface DatabaseViewState {
  selectedSets?: Array<DtoCardSet>;
  selectedCards?: Array<CardViewmodel>;
}
