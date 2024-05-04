import { ColumnType, Insertable, Selectable, Updateable } from "kysely";

import { CardColorType, MTGColor } from "../../../../common/enums";
import { Synchronized } from "../base.types";

export interface CardColorMap extends Synchronized {
  card_id: ColumnType<string, string, never>;
  color_type: ColumnType<CardColorType, CardColorType, never>
  color_id: ColumnType<MTGColor, MTGColor, never>;
}

export type CardColor = Selectable<CardColorMap>;
export type InsertCardColor = Insertable<CardColorMap>;
export type UpdateCardColor = Updateable<CardColorMap>;