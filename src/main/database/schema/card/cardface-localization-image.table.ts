import { ColumnType, Insertable, Selectable, Updateable } from "kysely";

import { ImageSize } from "../../../../common/enums";

export interface CardFaceLocalizationImageTable {
  cardface_localization_id: ColumnType<string, string, never>;
  image_type: ColumnType<ImageSize, ImageSize, never>;
  uri: ColumnType<string>;
}

export type CardFaceLocalizationImage = Selectable<CardFaceLocalizationImageTable>;
export type InsertCardFaceLocalizationImage = Insertable<CardFaceLocalizationImageTable>;
export type UpdateCardFaceLocalizationImage = Updateable<CardFaceLocalizationImageTable>;
