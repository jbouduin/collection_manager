import { ColumnType, Insertable, Selectable, Updateable } from "kysely";

import { MTGColorType, MTGColor } from "../../../../common/enums";
import { Synchronized } from "../base.types";

export interface CardFaceColorMapTable extends Synchronized {
  cardface_id: ColumnType<string, string, never>;
  color_type: ColumnType<MTGColorType, MTGColorType, never>
  color_id: ColumnType<MTGColor, MTGColor, never>;
}

export type CardFaceColorMap = Selectable<CardFaceColorMapTable>;
export type InsertCardFaceColorMap = Insertable<CardFaceColorMapTable>;
export type UpdateCardFaceColorMap = Updateable<CardFaceColorMapTable>;
