import { Selectable } from "kysely";
import { CardFaceColorMapTable, CardSymbolAlternativeTable, CardSymbolColorMapTable, LanguageTable, OracleLegalityTable, OracleRulingLineTable, OracleTable } from "../../../main/database/schema";
import { CatalogType } from "../../types";


export type ICardfaceColorDto = Selectable<CardFaceColorMapTable>;
export type IMtgCardSymbolColorMapDto = Selectable<CardSymbolColorMapTable>;
export type IMtgCardSymbolAlternative = Selectable<CardSymbolAlternativeTable>;
export type ILanguageDto = Selectable<LanguageTable>;
export type ILegalityDto = Selectable<OracleLegalityTable>;
export type IOracleDto = Selectable<OracleTable>;
export type IOracleLegalityDto = Selectable<OracleLegalityTable>;
export type IOracleRulingLineDto = Selectable<OracleRulingLineTable>;
export type CardQueryParamToken =
  "set" |
  "format" |
  "rarity" |
  "own" |
  "ic" | // identity color
  "cc" | // card color
  "pm" | // produced mana color
  CatalogType;
