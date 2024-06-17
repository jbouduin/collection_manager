import { Insertable, Selectable, Updateable } from "kysely";

import { CardFaceColorMapTable, CatalogItemTable, CollectionTable, ColorTable, LanguageTable, OracleLegalityTable, OracleRulingLineTable, OracleTable } from "../../main/database/schema";

export type CatalogItemDto = Selectable<CatalogItemTable>;
export type ColorDto = Selectable<ColorTable>;
export type DtoCollection = Selectable<CollectionTable>;
export type NewCollection = Insertable<CollectionTable>;
export type UpdateCollection = Updateable<CollectionTable>;
export type DtoLanguage = Selectable<LanguageTable>;
export type DtoRulingLine = Selectable<OracleRulingLineTable>;
export type DtoOracle = Selectable<OracleTable>;
export type DtoCardfaceColor = Selectable<CardFaceColorMapTable>;
export type DtoLegality = Selectable<OracleLegalityTable>;

export type IdSelectResult = { id: string };
export type CardSide = "front" | "back";
