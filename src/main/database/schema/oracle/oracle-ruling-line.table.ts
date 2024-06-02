import { ColumnType } from "kysely";

import { RulingSource } from "../../../../common/enums";

// TODO date and datetime issues: sqlite + tsyringe never returns a date in the selectable, it is always a string
export interface OracleRulingLineTable {
  oracle_id: ColumnType<string, string, never>;
  source: ColumnType<RulingSource, RulingSource, never>;
  published_at: ColumnType<Date, string, never>;
  comments: ColumnType<string>;
}
