import { ColumnType, Insertable, Selectable, Updateable } from "kysely";
import { SyncedMap } from "../synced.map";

export interface CardRulingMap extends SyncedMap {
  card_id: ColumnType<string, string, never>;
  ruling_id: ColumnType<string, string, never>;
}

export type CardRuling = Selectable<CardRulingMap>;
export type NewCardRuling = Insertable<CardRulingMap>;
export type UpdateCardRuling = Updateable<CardRulingMap>;
