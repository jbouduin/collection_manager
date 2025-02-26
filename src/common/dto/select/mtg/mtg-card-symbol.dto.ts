import { Selectable } from "kysely";
import { CardSymbolAlternativeTable, CardSymbolColorMapTable, CardSymbolTable } from "../../../../main/database/schema";

export type MtgCardSymbolColorMapDto = Selectable<CardSymbolColorMapTable>;
export type MtgCardSymbolAlternative = Selectable<CardSymbolAlternativeTable>;

export interface MtgCardSymbolDto extends Selectable<CardSymbolTable> {
  colors: Array<MtgCardSymbolColorMapDto>;
  alternatives: Array<MtgCardSymbolAlternative>;
}
