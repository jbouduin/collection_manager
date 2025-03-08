import { CollectionManagerProps } from "../../../../../../shared/components/base/collection-manager.props";
import { DeckListViewmodel } from "../../../../../viewmodels";

export interface CenterPanelProps extends CollectionManagerProps {
  decks: Array<DeckListViewmodel>;
  onDecksSelected: (decks: Array<DeckListViewmodel>) => void;
  onDeleteDeck: (deck: DeckListViewmodel) => void;
  onEditDeck: (deck: DeckListViewmodel) => void;
}
