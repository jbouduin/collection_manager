import { Insertable, Selectable, Updateable } from "kysely";
import { CardFaceColorMapTable, CatalogItemTable, CollectionTable, ColorTable, LanguageTable, OracleLegalityTable, OracleRulingLineTable, OracleTable } from "../../main/database/schema";

export type CatalogItemDto = Selectable<CatalogItemTable>;
export type ColorDto = Selectable<ColorTable>;
export type CollectionDto = Selectable<CollectionTable>;
export type NewCollection = Insertable<CollectionTable>;
export type UpdateCollection = Updateable<CollectionTable>;
export type LanguageDto = Selectable<LanguageTable>;
export type RulingLineDto = Selectable<OracleRulingLineTable>;
export type DtoOracle = Selectable<OracleTable>;
export type CardfaceColorDto = Selectable<CardFaceColorMapTable>;
export type LegalityDto = Selectable<OracleLegalityTable>;

export type IdSelectResult = { id: string };
