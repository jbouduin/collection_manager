import { CardLegality, MtgGameFormat } from "../../types";

export interface IDeckLegalityDto {
  format: MtgGameFormat;
  legality: CardLegality;
}
