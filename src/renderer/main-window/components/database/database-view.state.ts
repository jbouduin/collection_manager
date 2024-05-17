import { CardDto, CardSetDto } from "../../../../common/dto";

export interface DatabaseViewState {
  // selectedSetPath?: Array<number>;
  selectedSets?: Array<CardSetDto>;
  selectedCards?: Array<CardDto>;
}
