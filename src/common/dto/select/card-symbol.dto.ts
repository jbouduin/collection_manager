import { CardSymbolTable } from "../../../main/database/schema";

import { CardSymbolAlternativeDto, CardSymbolColorMapDto } from "..";
import { Selectable } from "kysely";

export interface CardSymbolDto {
  cardSymbol: Selectable<CardSymbolTable>;
  colors: Array<CardSymbolColorMapDto>;
  alternatives: Array<CardSymbolAlternativeDto>;
}

// LATER would be nice to have it like but then we need an efficient way to construct it
// export interface CardSymbolDto extends CardSymbol {
//   colors: Array<CardSymbolColorMap>;
//   alternatives: Array<CardSymbolAlternative>;
// }
// or
// export type CardSymbolSelectDto = CardSymbol & {
//   colors: Array<CardSymbolColorMap>;
//   alternatives: Array<CardSymbolAlternative>;
// }
