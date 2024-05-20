import { CardSymbol, CardSymbolAlternative, CardSymbolColorMap } from "../../../main/database/schema";

export interface CardSymbolDto {
  cardSymbol: CardSymbol;
  colors: Array<CardSymbolColorMap>;
  alternatives: Array<CardSymbolAlternative>;
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
