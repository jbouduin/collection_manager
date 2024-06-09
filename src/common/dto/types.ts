import { Selectable } from "kysely";

import { CardFaceColorMapTable, CatalogItemTable, ColorTable, LanguageTable, OracleLegalityTable, OracleRulingLineTable, OracleTable } from "../../main/database/schema";

export type CatalogItemDto = Selectable<CatalogItemTable>;
export type ColorDto = Selectable<ColorTable>;
export type DtoLanguage = Selectable<LanguageTable>;
export type DtoRulingLine = Selectable<OracleRulingLineTable>;
export type DtoOracle = Selectable<OracleTable>;
export type DtoCardfaceColor = Selectable<CardFaceColorMapTable>;
export type DtoLegality = Selectable<OracleLegalityTable>;

export type IdSelectResult = { id: string };
