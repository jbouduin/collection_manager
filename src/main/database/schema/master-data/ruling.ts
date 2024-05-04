import { ColumnType, Insertable, Selectable, Updateable } from "kysely";

import { RulingSource } from "../../../../common/enums";
import { Synchronized } from "../base.types";

export interface RulingTable extends Synchronized {
  oracle_id: ColumnType<string, string, never>;
  source: ColumnType<RulingSource, RulingSource, never>;
  published_at: ColumnType<Date, string, never>;
  comments: ColumnType<string>;
}

export type Ruling = Selectable<RulingTable>;
export type InsertRuling = Insertable<RulingTable>;
export type UpdateRuling = Updateable<RulingTable>;
