import { DeckListViewmodel } from "../../../../../viewmodels";

export interface CenterPanelState {
  decks: Array<DeckListViewmodel>;
  sortedIndexMap: Array<number>;
}
