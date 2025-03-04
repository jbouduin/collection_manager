import { CardLegality, GameFormat } from "../../types";

export interface DeckLegalityDto {
  format: GameFormat;
  legality: CardLegality;
}
