import { ColumnType, Insertable, Selectable, Updateable } from "kysely";

import { Synchronized } from "../base.types";

// NOW not synchronized
export interface CardSymbolAlternativeTable extends Synchronized {
  /**
   * The Id
   * @example "W"
   */
  card_symbol_id: ColumnType<string, string, never>;

  /***
   * Plaintext versions of the symbol that Gatherer uses on old cards to describe original printed text.
   * @example {W} has ["oW", "ooW"] as alternates.
   */
  alternative: ColumnType<string, string, never>;
}

export type CardSymbolAlternative = Selectable<CardSymbolAlternativeTable>;
export type NewCardSymbolAlternative = Insertable<CardSymbolAlternativeTable>;
export type UpdateCardSymbolAlternative = Updateable<CardSymbolAlternativeTable>;
