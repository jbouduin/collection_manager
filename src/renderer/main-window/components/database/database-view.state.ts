import { CardSelectDto, CardSetSelectDto } from "../../../../common/dto";

export interface DatabaseViewState {
  // selectedSetPath?: Array<number>;
  selectedSets?: Array<CardSetSelectDto>;
  selectedCards?: Array<CardSelectDto>;
}
