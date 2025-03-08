import { CardLegality, MtgGameFormat } from "../../types";

export interface DeckLegalityDto {
  format: MtgGameFormat;
  legality: CardLegality;
}
