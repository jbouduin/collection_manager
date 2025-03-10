import { NonSynchronized } from "../base.types";

export interface DeckCardTable extends NonSynchronized {
  deck_id: number;
  card_id: number;
  deck_quantity: number;
  sideboard_quantity: number;
}
