import { Selectable } from "kysely";
import { CardFaceColorMapTable, LanguageTable, OracleLegalityTable, OracleRulingLineTable, OracleTable } from "../../../../main/database/schema";


export type CardfaceColorDto = Selectable<CardFaceColorMapTable>;
export type LanguageDto = Selectable<LanguageTable>;
export type LegalityDto = Selectable<OracleLegalityTable>;
export type OracleDto = Selectable<OracleTable>;
export type RulingLineDto = Selectable<OracleRulingLineTable>;
