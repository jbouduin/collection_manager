import { Selectable } from "kysely";
import { CardFaceColorMapTable, CatalogItemTable, ColorTable, LanguageTable, OracleLegalityTable, OracleRulingLineTable, OracleTable } from "../../../../main/database/schema";

export type CatalogItemDto = Selectable<CatalogItemTable>;
export type ColorDto = Selectable<ColorTable>;
export type LanguageDto = Selectable<LanguageTable>;
export type RulingLineDto = Selectable<OracleRulingLineTable>;
export type OracleDto = Selectable<OracleTable>;
export type CardfaceColorDto = Selectable<CardFaceColorMapTable>;
export type LegalityDto = Selectable<OracleLegalityTable>;
