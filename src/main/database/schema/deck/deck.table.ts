import { ColumnType } from "kysely";
import { NonSynchronized } from "../base.types";
import { MtgGameFormat } from "../../../../common/types";

export interface DeckTable extends NonSynchronized {
  id: ColumnType<number, never, never>;
  parent_id?: ColumnType<number, number | undefined>;
  name: ColumnType<string>;
  description?: ColumnType<string | undefined>;
  target_format?: ColumnType<MtgGameFormat, string, string>;
  is_system: ColumnType<boolean, number, never>;
  is_folder: ColumnType<boolean, number, never>;
}
