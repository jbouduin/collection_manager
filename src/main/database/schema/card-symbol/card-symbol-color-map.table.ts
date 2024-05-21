import { ColumnType, Insertable, Selectable, Updateable } from "kysely";

import { MTGColor } from "../../../../common/enums";
import { Synchronized } from "../base.types";

// NOW not synchronized
export interface CardSymbolColorMapTable extends Synchronized {
  /***
   * The plaintext symbol. Often surrounded with curly braces {}. Note that not all symbols are ASCII text (for example, {∞}).
   * Contains the property "symbol" as returned by scryfall
   * @example "{T}"
   */
  card_symbol_id: ColumnType<string, string, never>;

  /**
   * The single character color Id
   * @example "W"
   */
  color_id: ColumnType<MTGColor, string, never>;
}

export type CardSymbolColorMap = Selectable<CardSymbolColorMapTable>;
export type NewCardSymbolColorMap = Insertable<CardSymbolColorMapTable>;
export type UpdateCardSymbolColorMap = Updateable<CardSymbolColorMapTable>;
