import { CollectionManagerProps } from "../../../../shared/components/base/collection-manager.props";
import { DeckCardListViewmodel } from "../../../viewmodels";


export interface LeftPanelProps extends CollectionManagerProps {
  deckId: number;
  onCardsSelected: (cards: Array<DeckCardListViewmodel>) => void;
}
