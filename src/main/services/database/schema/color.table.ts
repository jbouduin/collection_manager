import { ColumnType, Insertable, Selectable, Updateable } from "kysely";
import { NonSyncedTable } from "./non-synced.table";
import { BasicLandType, MTGColor } from "../../../../common/enums";

// fields are not updateable in code: if required Colors will be updated during migration
export interface ColorTable extends NonSyncedTable {
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
  // TODO could be a reference to symbology , but that will only work if symbology has been loaded
  mana_symbol: ColumnType<string, string, never>
}

export type Color = Selectable<ColorTable>;
export type NewColor = Insertable<ColorTable>;
export type UpdateColor = Updateable<ColorTable>;
