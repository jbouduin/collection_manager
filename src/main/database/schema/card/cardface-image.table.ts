import { ColumnType } from "kysely";

import { ImageSize } from "../../../../common/enums";

export interface CardFaceImageTable {
  cardface_id: ColumnType<string, string, never>;
  image_type: ColumnType<ImageSize, ImageSize, never>;
  uri: ColumnType<string>;
}
