import { Props } from "@blueprintjs/core";
import { DeckCardListViewmodel } from "../../../../viewmodels";


export interface LeftPanelTopProps extends Props {
  cards: Array<DeckCardListViewmodel>;
  onCardsSelected: (cards: Array<DeckCardListViewmodel>) => void;
}
