import { ColumnType } from "kysely";

import { MTGColor, MTGColorType } from "../../../../common/enums";

export interface CardColorMapTable {
  card_id: ColumnType<string, string, never>;
  color_type: ColumnType<MTGColorType, MTGColorType, never>
  color_id: ColumnType<MTGColor, MTGColor, never>;
}
