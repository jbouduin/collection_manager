import { ColumnType } from "kysely";
import { MtgColor } from "../../../../common/types";


export interface CardSymbolColorMapTable {
  /**
   * The plaintext symbol. Often surrounded with curly braces {}. Note that not all symbols are ASCII text (for example, {∞}).
   * Contains the property "symbol" as returned by scryfall
   * @example "{T}"
   */
  card_symbol_id: ColumnType<string, string, never>;

  /**
   * The single character color Id
   * @example "W"
   */
  color_id: ColumnType<MtgColor, string, never>;
}
