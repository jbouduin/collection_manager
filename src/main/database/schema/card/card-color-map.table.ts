import { ColumnType, Insertable, Selectable, Updateable } from "kysely";

import { MTGColorType, MTGColor } from "../../../../common/enums";
import { Synchronized } from "../base.types";

// LATER make this non synchronized and delete existing once when syncing
export interface CardColorMapTable extends Synchronized {
  card_id: ColumnType<string, string, never>;
  color_type: ColumnType<MTGColorType, MTGColorType, never>
  color_id: ColumnType<MTGColor, MTGColor, never>;
}

export type CardColorMap = Selectable<CardColorMapTable>;
export type InsertCardColorMap = Insertable<CardColorMapTable>;
export type UpdateCardColorMap = Updateable<CardColorMapTable>;
