import { Props } from "@blueprintjs/core";
import { DeckListViewmodel } from "../../../../../viewmodels";


export interface CenterPanelProps extends Props {
  decks: Array<DeckListViewmodel>;
  onDecksSelected: (decks: Array<DeckListViewmodel>) => void;
  onDeleteDeck: (deck: DeckListViewmodel) => void;
  onEditDeck: (deck: DeckListViewmodel) => void;
}
