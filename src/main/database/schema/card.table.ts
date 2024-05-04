import { ColumnType, Insertable, Selectable, Updateable } from "kysely";
import { SyncedTable } from "./synced.table";
import { CardLayout, MTGLanguage } from "../../../common/enums";


export interface CardTable extends SyncedTable {
  //#region Core fields -------------------------------------------------------
  /**
   * A unique ID for this card’s oracle identity.
   * This value is consistent across reprinted card editions, and unique among different cards with the same name (tokens, Unstable variants, etc).
   * Always present except for the reversible_card layout where it will be absent; oracle_id will be found on each face instead.
   */
  oracle_id: ColumnType<string, string | undefined, string>;

  /**
   * A language code for this printing.
   */
  lang: ColumnType<MTGLanguage, MTGLanguage, never>;

  /**
   * A code for this card’s layout.
   */
  layout: ColumnType<CardLayout, CardLayout, never>;

  /**
   * A link to where you can begin paginating all re/prints for this card on Scryfall’s API.
   */
  prints_search_uri: ColumnType<string>;

  /**
   * A link to this card’s rulings list on Scryfall’s API.
   */
  rulings_uri: ColumnType<string>;

  /**
   * A link to this card’s permapage on Scryfall’s website.
   */
  scryfall_uri: ColumnType<string>;

  /**
   * A link to this card object on Scryfall’s API.
   */
  uri: ColumnType<string>;
  //#endregion Core Fields

  //#region Vendor references -------------------------------------------------
  /**
     * This card’s Arena ID, if any. A large percentage of cards are not available on Arena and do not have this ID.
     */
  arena_id?: ColumnType<number, number | undefined, number>;

  /**
   * This card’s Magic Online ID (also known as the Catalog ID), if any. A large percentage of cards are not available on Magic Online and do not have this ID.
   */
  mtgo_id?: ColumnType<number, number | undefined, number>;

  /**
   * This card’s foil Magic Online ID (also known as the Catalog ID), if any. A large percentage of cards are not available on Magic Online and do not have this ID.
   */
  mtgo_foil_id?: ColumnType<number, number | undefined, number>;

  /**
   * This card’s ID on TCGplayer’s API, also known as the productId.
   */
  tcgplayer_id?: ColumnType<number, number | undefined, number>;

  /**
   * This card’s ID on TCGplayer’s API, for its etched version if that version is a separate product.
   */
  tcgplayer_etched_id?: ColumnType<number, number | undefined, number>;

  /**
   * This card’s ID on Cardmarket’s API, also known as the idProduct.
   */
  cardmarket_id?: ColumnType<number, number | undefined, number>;
  //#endregion
}

export type Card = Selectable<CardTable>;
export type NewCard = Insertable<CardTable>;
export type UpdateCard = Updateable<CardTable>;
