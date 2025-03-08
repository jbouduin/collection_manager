import { ColumnType } from "kysely";
import { MtgColor, MtgColorType } from "../../../../common/types";

export interface CardFaceColorMapTable {
  card_id: ColumnType<string, string, never>;
  sequence: ColumnType<number, number, never>;
  color_type: ColumnType<MtgColorType, MtgColorType, never>;
  color_id: ColumnType<MtgColor, MtgColor, never>;
}
