import { ColumnType, Insertable, Selectable, Updateable } from "kysely";
import { CardRelatedCardComponent } from "../../../../common/enums";
import { SyncedMap } from "../synced.map";

export interface CardCardMap extends SyncedMap {
  card_id: ColumnType<string, string, never>;
  related_card_id: ColumnType<string, string, never>;
  component: ColumnType<CardRelatedCardComponent, CardRelatedCardComponent, never>;
}

export type CardRelatedCard = Selectable<CardCardMap>;
export type InsertCardRelatedCard = Insertable<CardCardMap>;
export type UpdateCardRelatedCard = Updateable<CardCardMap>;
