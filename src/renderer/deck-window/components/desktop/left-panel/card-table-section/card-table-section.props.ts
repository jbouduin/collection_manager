import { Props } from "@blueprintjs/core";
import { DeckCardListViewmodel } from "../../../../viewmodels";

export interface CardTableSectionProps extends Props {
  cards: Array<DeckCardListViewmodel>;
  content: "deck" | "sideboard";
  isOpen: boolean;
  onCardsSelected: (cards: Array<DeckCardListViewmodel>) => void;
  onToggleCollaps: () => void;
}
