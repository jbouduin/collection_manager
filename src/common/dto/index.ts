import { Selectable } from "kysely";

import { CardFaceColorMapTable, CatalogItemTable, ColorTable, LanguageTable, OracleLegalityTable, OracleRulingLineTable, OracleTable } from "../../main/database/schema";

export * from "./select/card-face.dto";
export * from "./select/card-image.dto";
export * from "./select/card-language.dto";
export * from "./select/card-set.dto";
export * from "./select/card-symbol.dto";
export * from "./select/card.dto";

export type CatalogItemDto = Selectable<CatalogItemTable>;
export type ColorDto = Selectable<ColorTable>;
export type DtoLanguage = Selectable<LanguageTable>;
export type DtoRulingLine = Selectable<OracleRulingLineTable>;
export type OracleDto = Selectable<OracleTable>;
export type DtoCardfaceColor = Selectable<CardFaceColorMapTable>;
export type DtoLegality = Selectable<OracleLegalityTable>;
