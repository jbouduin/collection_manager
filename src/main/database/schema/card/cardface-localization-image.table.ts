import { ColumnType, Insertable, Selectable, Updateable } from "kysely";

import { ImageSize } from "../../../../common/enums";
import { Synchronized } from "../base.types";

export interface CardFaceLocalizationImageTable extends Synchronized{
  cardface_id: ColumnType<string, string, never>;
  image_type: ColumnType<ImageSize, ImageSize, never>;
  uri: ColumnType<string>;
}

export type CardFaceLocalization = Selectable<CardFaceLocalizationImageTable>;
export type InsertCardFaceLocalizationImage = Insertable<CardFaceLocalizationImageTable>;
export type UpdateCardFaceLocalizationImage = Updateable<CardFaceLocalizationImageTable>;
