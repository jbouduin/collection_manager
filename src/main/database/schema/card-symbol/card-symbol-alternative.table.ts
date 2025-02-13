import { ColumnType } from "kysely";

// LATER update oracle texts that use alternatives during sync

export interface CardSymbolAlternativeTable {
  /**
   * The Id
   * @example "W"
   */
  card_symbol_id: ColumnType<string, string, never>;

  /**
   * Plaintext versions of the symbol that Gatherer uses on old cards to describe original printed text.
   * @example {W} has ["oW", "ooW"] as alternates.
   */
  alternative: ColumnType<string, string, never>;
}
