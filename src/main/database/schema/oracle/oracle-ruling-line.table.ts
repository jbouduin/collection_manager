import { ColumnType, Insertable, Selectable } from "kysely";

import { RulingSource } from "../../../../common/enums";

// LATER sqlite + tsyringe never returns a date in the selectable
export interface OracleRulingLineTable {
  oracle_id: ColumnType<string, string, never>;
  source: ColumnType<RulingSource, RulingSource, never>;
  published_at: ColumnType<Date, string, never>;
  comments: ColumnType<string>;
}

export type OracleRulingLine = Selectable<OracleRulingLineTable>;
export type OracleInsertRulingLine = Insertable<OracleRulingLineTable>;
// NOT used export type UpdateRulingLine = Updateable<OracleRulingLineTable>;
