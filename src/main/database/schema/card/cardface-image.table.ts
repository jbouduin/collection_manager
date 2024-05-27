import { ColumnType } from "kysely";

import { ImageSize } from "../../../../common/enums";

export interface CardFaceImageTable {
  card_id: ColumnType<string, string, never>;
  sequence: ColumnType<number, number, never>;
  image_type: ColumnType<ImageSize, ImageSize, never>;
  uri: ColumnType<string>;
}