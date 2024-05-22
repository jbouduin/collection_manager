import { ColumnType } from "kysely";

import { BasicLandType, MTGColor } from "../../../../common/enums";
import { NonSynchronized } from "../base.types";

// fields are not updateable in code: if required Colors will be updated during migration
export interface ColorTable extends NonSynchronized {
  /**
   * The single character color Id
   * @example "W"
   */
  id: ColumnType<MTGColor, string, never>;

  sequence: ColumnType<number, number, never>;

  /***
   * The display text
   */
  display_text: ColumnType<string, string, never>;
  /***
   * The land type for this color
   */
  // TODO this could be a reference to the catalog landtypes ColumnType<CardT, string, never>, but that will only work if catalogs has been loaded
  land_type: ColumnType<BasicLandType, BasicLandType, never>
  /***
   * Mana symbol
  */
  // TODO could be a reference to card symbol , but that will only work if card symbols have been loaded
  mana_symbol: ColumnType<string, string, never>
}
