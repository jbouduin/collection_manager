import { ColumnType, Insertable, Selectable, Updateable } from "kysely";

import { CardLegality, GameFormat } from "../../../../common/enums";
import { Synchronized } from "../base.types";

export interface CardFormatLegalityTable extends Synchronized {
  card_id: ColumnType<string, string, never>;
  format: ColumnType<GameFormat, GameFormat, never>;
  legality: ColumnType<CardLegality>;
}

export type CardFormatLegality = Selectable<CardFormatLegalityTable>;
export type InsertFormatCardLegality = Insertable<CardFormatLegalityTable>;
export type UpdateFormatCardLegality = Updateable<CardFormatLegalityTable>;
