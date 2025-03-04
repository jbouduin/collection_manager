import { ColumnType } from "kysely";
import { NonSynchronized } from "../base.types";
import { GameFormat } from "../../../../common/types";

export interface DeckTable extends NonSynchronized {
  id: ColumnType<number, never, never>;
  name: ColumnType<string>;
  description?: ColumnType<string | undefined>;
  target_format?: ColumnType<GameFormat, string, string>;
}
