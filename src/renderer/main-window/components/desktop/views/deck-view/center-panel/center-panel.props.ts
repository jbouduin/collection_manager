import { CollectionManagerProps } from "../../../../../../shared/collection-manager.props";
import { DeckListViewmodel } from "../../../../../viewmodels";

export interface CenterPanelProps extends CollectionManagerProps {
  decks: Array<DeckListViewmodel>;
  onDecksSelected: (decks: Array<DeckListViewmodel>) => void;
  onDeleteDeck: (deck: DeckListViewmodel) => void;
  onEditDeck: (deck: DeckListViewmodel) => void;
}
