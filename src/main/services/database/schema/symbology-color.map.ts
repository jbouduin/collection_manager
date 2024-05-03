import { ColumnType, Insertable, Selectable, Updateable } from "kysely";
import { MTGColor } from "../../../../common/enums";
import { SyncedMap } from "./synced.map";

export interface SymbologyColorMapTable extends SyncedMap {

  /***
   * The plaintext symbol. Often surrounded with curly braces {}. Note that not all symbols are ASCII text (for example, {∞}).
   * Contains the property "symbol" as returned by scryfall
   * @example "{T}"
   */
  symbology_id: ColumnType<string, string, never>;

  /**
   * The single character color Id
   * @example "W"
   */
  color_id: ColumnType<MTGColor, string, never>;
}

export type SymbologyColorMap = Selectable<SymbologyColorMapTable>;
export type NewSymbologyColorMap = Insertable<SymbologyColorMapTable>;
export type UpdateSymbologyColorMap = Updateable<SymbologyColorMapTable>;
