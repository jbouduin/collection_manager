import { ColumnType, Insertable, Selectable, Updateable } from "kysely";

import { Synchronized } from "../base.types";

export interface RulingTable extends Synchronized {
  oracle_id: ColumnType<string, string, never>;
}

export type Ruling = Selectable<RulingTable>;
export type InsertRuling = Insertable<RulingTable>;
export type UpdateRuling = Updateable<RulingTable>;
