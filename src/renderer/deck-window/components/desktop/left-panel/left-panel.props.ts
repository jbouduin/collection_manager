import { Props } from "@blueprintjs/core";
import { DeckCardListViewmodel } from "../../../viewmodels";


export interface LeftPanelProps extends Props {
  deckId: number;
  onCardsSelected: (cards: Array<DeckCardListViewmodel>) => void;
}
