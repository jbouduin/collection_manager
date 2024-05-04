import { ColumnType, Insertable, Selectable, Updateable } from "kysely";

import { ImageType } from "../../../../common/enums";
import { Synchronized } from "../base.types";

export interface CardImageTable extends Synchronized{
  card_id: ColumnType<string, string, never>;
  image_type: ColumnType<ImageType, ImageType, never>;
  uri: ColumnType<string>;
}

export type CardImage = Selectable<CardImageTable>;
export type InsertCardImage = Insertable<CardImageTable>;
export type UpdateCardImage = Updateable<CardImageTable>;
