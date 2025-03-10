import { Props } from "@blueprintjs/core";
import { DeckCardListViewmodel } from "../../../../../main-window/viewmodels";

export interface LeftPanelTopProps extends Props {
  cards: Array<DeckCardListViewmodel>;
  onCardsSelected: (cards: Array<DeckCardListViewmodel>) => void;
}
