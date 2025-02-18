import { ColumnType } from "kysely";
import { NonSynchronized } from "../base.types";
import { CardCondition } from "../../../../common/types";

export interface CardConditionTable extends NonSynchronized {
  id: ColumnType<CardCondition, string, never>;
  sequence: ColumnType<number, number, never>;
  color_code: ColumnType<string>;
  expression: ColumnType<string>;
  condition: ColumnType<string>;
  us_expression: ColumnType<string>;
  description: ColumnType<string>;
}
