import { ColumnType, Insertable, Selectable, Updateable } from "kysely";

import { ImageType } from "../../../../common/enums";
import { Synchronized } from "../base.types";

export interface CardFaceImageTable extends Synchronized{
  cardface_id: ColumnType<string, string, never>;
  image_type: ColumnType<ImageType, ImageType, never>;
  uri: ColumnType<string>;
}

export type CardFaceImage = Selectable<CardFaceImageTable>;
export type InsertCardFaceImage = Insertable<CardFaceImageTable>;
export type UpdateCardFaceImage = Updateable<CardFaceImageTable>;
