import { ColumnType } from "kysely";
import { BasicLandType, MTGColor } from "../../../../common/types";
import { NonSynchronized } from "../base.types";

// fields are not updateable in code: if required Colors will be updated during migration
export interface ColorTable extends NonSynchronized {
  /**
   * The single character color Id
   * @example "W"
   */
  id: ColumnType<MTGColor, string, never>;
  sequence: ColumnType<number, number, never>;
  /**
   * The display text
   */
  display_text: ColumnType<string, string, never>;
  /**
   * The land type for this color
   */
  land_type?: ColumnType<BasicLandType, BasicLandType, never>;
  /**
   * Mana symbol
   */
  mana_symbol: ColumnType<string, string, never>;
}
