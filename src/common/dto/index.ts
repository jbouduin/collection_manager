import { Selectable } from "kysely";
import { CardSymbolAlternativeTable, CardSymbolColorMapTable, CatalogItemTable, ColorTable, LanguageTable, OracleRulingLineTable, OracleTable } from "../../main/database/schema";

export * from "./select/card-face.dto";
export * from "./select/card-image.dto";
export * from "./select/card-set.dto";
export * from "./select/card-symbol.dto";
export * from "./select/card.dto";

export type CatalogItemDto = Selectable<CatalogItemTable>;
export type ColorDto = Selectable<ColorTable>;
export type LanguageDto = Selectable<LanguageTable>;
export type RulingLineDto = Selectable<OracleRulingLineTable>;
export type CardSymbolColorMapDto = Selectable<CardSymbolColorMapTable>;
export type CardSymbolAlternativeDto = Selectable<CardSymbolAlternativeTable>;
export type OracleDto = Selectable<OracleTable>;
