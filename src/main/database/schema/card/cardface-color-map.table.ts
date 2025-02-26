import { ColumnType } from "kysely";
import { MTGColor, MTGColorType } from "../../../../common/types";

export interface CardFaceColorMapTable {
  card_id: ColumnType<string, string, never>;
  sequence: ColumnType<number, number, never>;
  color_type: ColumnType<MTGColorType, MTGColorType, never>;
  color_id: ColumnType<MTGColor, MTGColor, never>;
}
