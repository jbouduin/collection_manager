import { DeckCardListViewmodel } from "../../../../main-window/viewmodels";
import { CollectionManagerProps } from "../../../../shared/components/base/collection-manager.props";

export interface LeftPanelProps extends CollectionManagerProps {
  deckId: number;
  onCardsSelected: (cards: Array<DeckCardListViewmodel>) => void;
}
