import { ColumnType } from "kysely";
import { CardRelatedCardComponent } from "../../../../common/types";


export interface CardCardMapTable {
  card_id: ColumnType<string, string, never>;
  related_card_id: ColumnType<string, string, never>;
  component: ColumnType<CardRelatedCardComponent, CardRelatedCardComponent, never>;
}
