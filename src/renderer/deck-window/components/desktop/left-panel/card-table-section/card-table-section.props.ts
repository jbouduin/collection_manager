import { Props } from "@blueprintjs/core";
import { DeckCardListViewmodel } from "../../../../viewmodels";
import { DeckContentType } from "../../../../types";

export interface CardTableSectionProps extends Props {
  cards: Array<DeckCardListViewmodel>;
  content: DeckContentType;
  isOpen: boolean;
  onCardDecrease: (card: DeckCardListViewmodel) => void;
  onCardIncrease: (card: DeckCardListViewmodel) => void;
  onCardRemove: (card: DeckCardListViewmodel) => void;
  onCardsSelected: (cards: Array<DeckCardListViewmodel>) => void;
  onToggleCollaps: () => void;
}
