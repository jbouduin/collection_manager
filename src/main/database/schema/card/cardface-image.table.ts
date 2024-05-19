import { ColumnType, Insertable, Selectable, Updateable } from "kysely";

import { ImageSize } from "../../../../common/enums";
import { Synchronized } from "../base.types";

export interface CardFaceImageTable extends Synchronized{
  cardface_id: ColumnType<string, string, never>;
  image_type: ColumnType<ImageSize, ImageSize, never>;
  uri: ColumnType<string>;
}

export type CardFaceImage = Selectable<CardFaceImageTable>;
export type InsertCardFaceImage = Insertable<CardFaceImageTable>;
export type UpdateCardFaceImage = Updateable<CardFaceImageTable>;
