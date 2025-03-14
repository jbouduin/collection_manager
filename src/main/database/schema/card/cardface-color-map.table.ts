import { ColumnType } from "kysely";
import { MtgColor, MtgColorType } from "../../../../common/types";

// TODO shouldn't this be stored using oracle_id of the card face ?
export interface CardFaceColorMapTable {
  card_id: ColumnType<string, string, never>;
  sequence: ColumnType<number, number, never>;
  color_type: ColumnType<MtgColorType, MtgColorType, never>;
  color_id: ColumnType<MtgColor, MtgColor, never>;
}
