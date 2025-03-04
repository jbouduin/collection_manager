import { CollectionManagerProps } from "../../../../../../shared/collection-manager.props";
import { DisplayValueService } from "../../../../../../shared/context";
import { DeckListViewmodel } from "../../../../../viewmodels";

export interface CenterPanelProps extends CollectionManagerProps {
  displayServiceValueService: DisplayValueService;
  onDecksSelected: (decks: Array<DeckListViewmodel>) => void;
}
