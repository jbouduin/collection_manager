import { ColumnType } from "kysely";
import { SynchronizedWithStringId } from "../base.types";

export interface OracleTable extends SynchronizedWithStringId {
  face_name: ColumnType<string, string, string | undefined>;
  oracle_name: ColumnType<string, string, string | undefined>;
  oracle_text?: ColumnType<string, string | undefined, string | undefined>;
  type_line: ColumnType<string, string, string | undefined>;
}
