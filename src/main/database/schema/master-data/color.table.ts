import { ColumnType } from "kysely";
import { BasicLandType, MtgColor } from "../../../../common/types";
import { NonSynchronizedWithStringId } from "../base.types";

export interface ColorTable extends NonSynchronizedWithStringId<MtgColor> {
  sequence: ColumnType<number>;
  /**
   * The display text
   */
  display_text: ColumnType<string>;
  /**
   * The land type for this color
   */
  land_type?: ColumnType<BasicLandType>;
  /**
   * Mana symbol
   */
  mana_symbol: ColumnType<string>;
}
