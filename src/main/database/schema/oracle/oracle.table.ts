import { ColumnType } from "kysely";
import { Synchronized, SynchronizedWithStringId } from "../base.types";

export interface OracleTable extends Synchronized {
  oracle_id: ColumnType<string, string, string | undefined>;
  face_name: ColumnType<string, string, string | undefined>;
  oracle_name: ColumnType<string, string, string | undefined>;
  oracle_text?: ColumnType<string, string | undefined, string | undefined>;
  type_line: ColumnType<string, string, string | undefined>;
}
