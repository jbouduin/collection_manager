import { Selectable } from "kysely";
import { CardSymbolAlternativeTable, CardSymbolColorMapTable, CardSymbolTable } from "../../../main/database/schema";

export type IMtgCardSymbolColorMapDto = Selectable<CardSymbolColorMapTable>;
export type IMtgCardSymbolAlternative = Selectable<CardSymbolAlternativeTable>;

export interface IMtgCardSymbolDto extends Selectable<CardSymbolTable> {
  colors: Array<IMtgCardSymbolColorMapDto>;
  alternatives: Array<IMtgCardSymbolAlternative>;
}
