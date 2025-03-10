import { CardDto } from "../mtg";

export type DeckCardListDto = CardDto & {
  deck_quantity: number;
  side_board_quantity: number;
};
