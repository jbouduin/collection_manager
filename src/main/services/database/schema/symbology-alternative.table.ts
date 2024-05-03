import { ColumnType, Insertable, Selectable, Updateable } from "kysely";
import { SyncedMap } from "./synced.map";


// fields are not updateable in code: if required SymbologyAlternatives will be updated during migration
export interface SymbologyAlternativeTable extends SyncedMap {
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
