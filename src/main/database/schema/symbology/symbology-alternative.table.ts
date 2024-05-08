import { ColumnType, Insertable, Selectable, Updateable } from "kysely";

import { Synchronized } from "../base.types";

export interface SymbologyAlternativeTable extends Synchronized {
  /**
   * The Symbology Id
   * @example "W"
   */
  symbology_id: ColumnType<string, string, never>;

  /***
   * Plaintext versions of the symbol that Gatherer uses on old cards to describe original printed text.
   * @example {W} has ["oW", "ooW"] as alternates.
   */
  alternative: ColumnType<string, string, never>;
}

export type SymbologyAlternative = Selectable<SymbologyAlternativeTable>;
export type NewSymbologyAlternative = Insertable<SymbologyAlternativeTable>;
export type UpdateSymbologyAlternative = Updateable<SymbologyAlternativeTable>;
