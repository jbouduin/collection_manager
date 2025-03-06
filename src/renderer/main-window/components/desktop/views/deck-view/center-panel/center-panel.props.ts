import { CollectionManagerProps } from "../../../../../../shared/collection-manager.props";
import { DisplayValueService } from "../../../../../../shared/context";
import { DeckListViewmodel } from "../../../../../viewmodels";

export interface CenterPanelProps extends CollectionManagerProps {
  decks: Array<DeckListViewmodel>;
  displayServiceValueService: DisplayValueService;
  // selectedFolderId: number;
  onDecksSelected: (decks: Array<DeckListViewmodel>) => void;
  onDeleteDeck: (deck: DeckListViewmodel) => void;
  onEditDeck: (deck: DeckListViewmodel) => void;
}
