import { ColumnType } from "kysely";
import { MtgColor, MtgColorType } from "../../../../common/types";

export interface CardColorMapTable {
  card_id: ColumnType<string, string, never>;
  color_type: ColumnType<MtgColorType, MtgColorType, never>;
  color_id: ColumnType<MtgColor, MtgColor, never>;
}
