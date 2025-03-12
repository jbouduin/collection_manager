import { Selectable } from "kysely";
import { CardFaceColorMapTable, LanguageTable, OracleLegalityTable, OracleRulingLineTable, OracleTable } from "../../../main/database/schema";


export type ICardfaceColorDto = Selectable<CardFaceColorMapTable>;
export type ILanguageDto = Selectable<LanguageTable>;
export type ILegalityDto = Selectable<OracleLegalityTable>;
export type IOracleDto = Selectable<OracleTable>;
export type IOracleLegalityDto = Selectable<OracleLegalityTable>;
export type IOracleRulingLineDto = Selectable<OracleRulingLineTable>;
