import { CardSymbolAlternativeTable, CardSymbolColorMapTable, CardSymbolTable } from "../../../main/database/schema";


import { Selectable } from "kysely";
export type DtoCardSymbolColorMap = Selectable<CardSymbolColorMapTable>;
export type DtoCardSymbolAlternative = Selectable<CardSymbolAlternativeTable>;

export interface DtoCardSymbol extends Selectable<CardSymbolTable> {
  colors: Array<DtoCardSymbolColorMap>;
  alternatives: Array<DtoCardSymbolAlternative>;
}
