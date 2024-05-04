import { ColumnType, Insertable, Selectable, Updateable } from "kysely";
import { SyncedTable } from "./synced.table";

export interface SymbologyTable extends SyncedTable {
  /***
   * The plaintext symbol. Often surrounded with curly braces {}. Note that not all symbols are ASCII text (for example, {∞}).
   * Contains the property "symbol" as returned by scryfall
   * @example "{T}"
   */
  id: ColumnType<string, string, never>;

  /***
   * e.g. "https://svgs.scryfall.io/card-symbols/T.svg"
   */
  svg_uri: ColumnType<string, string, string>;

  /***
   * An alternate version of this symbol, if it is possible to write it without curly braces.
   */
  loose_variant: ColumnType<string | undefined>;

  /***
   * An English snippet that describes this symbol. Appropriate for use in alt text or other accessible communication formats.
   * @example "tap this permanent"
   */
  english: ColumnType<string>

  /***
   * True if it is possible to write this symbol “backwards”. For example, the official symbol {U/P} is sometimes written as {P/U} or {P\U} in informal settings.
   * Note that the Scryfall API never writes symbols backwards in other responses. This field is provided for informational purposes.
   */
  transposable: ColumnType<boolean, number, number>;

  /***
   * True if this is a mana symbol.
   */
  represents_mana: ColumnType<boolean, number, number>;

  /***
   * True if this symbol appears in a mana cost on any Magic card.
   * For example {20} has this field set to false because {20} only appears in Oracle text, not mana costs.
   */
  appears_in_mana_costs: ColumnType<boolean, number, number>;

  /***
   * A decimal number representing this symbol’s mana value (also knowns as the converted mana cost).
   * Note that mana symbols from funny sets can have fractional mana values.
   */
  mana_value: ColumnType<number | undefined>;

  /***
   * True if the symbol is a hybrid mana symbol.
   * Note that monocolor Phyrexian symbols aren’t considered hybrid.
   */
  hybrid: ColumnType<boolean, number, number>;

  /***
   * True if the symbol is a Phyrexian mana symbol, i.e. it can be paid with 2 life.
   */
  phyrexian: ColumnType<boolean, number, number>;

  // TODO check what is the difference between this and mana_value
  /***
   * Converted mana cost ?
   */
  cmc: ColumnType<number | undefined>;

  /***
   * True if this symbol is only used on funny cards or Un-cards.
   */
  funny: ColumnType<boolean, number, number>;
}

export type Symbology = Selectable<SymbologyTable>;
export type NewSymbology = Insertable<SymbologyTable>;
export type UpdateSymbology = Updateable<SymbologyTable>;
