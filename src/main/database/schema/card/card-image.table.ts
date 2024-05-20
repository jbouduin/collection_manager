import { ColumnType, Insertable, Selectable, Updateable } from "kysely";

import { ImageSize } from "../../../../common/enums";
import { Synchronized } from "../base.types";

// NOW remove this
export interface CardImageTable extends Synchronized{
  card_id: ColumnType<string, string, never>;
  image_type: ColumnType<ImageSize, ImageSize, never>;
  uri: ColumnType<string>;
}

export type CardImage = Selectable<CardImageTable>;
export type InsertCardImage = Insertable<CardImageTable>;
export type UpdateCardImage = Updateable<CardImageTable>;
