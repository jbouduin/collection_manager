import { ColumnType, Insertable, Selectable, Updateable } from "kysely";
import { SyncedTable } from "./synced.table";

// TODO check ColumnType<Date, string | undefined, string> usage in detail
export interface CardSetTable extends SyncedTable {
  /**
   * The unique three to five-letter code for this set.
   */
  code: ColumnType<string, string, never>;
  /**
   * The unique code for this set on MTGO, which may differ from the regular code.
   */
  mtgo_code: ColumnType<string, string | undefined, string>;
  /**
   * The unique code for this set on Arena, which may differ from the regular code.
   */
  arena_code: ColumnType<string, string | undefined, string>;
  /**
   * This set’s ID on TCGplayer’s API, also known as the groupId.
   */
  tcgplayer_id?: ColumnType<number, number | undefined, number>;
  /**
   * The English name of the set.
   */
  name: ColumnType<string>;
  /**
   * A computer-readable classification for this set. See below.
   */
  set_type: ColumnType<string>;
  /**
   * The date the set was released or the first card was printed in the set (in GMT-8 Pacific time).
   */
  released_at: ColumnType<Date, string | undefined, string>;
  /**
   * The block code for this set, if any.
   */
  block_code: ColumnType<string, string | undefined, string>;
  /**
   * The block or group name code for this set, if any.
   */
  block: ColumnType<string, string | undefined, string>;
  /**
   * The set code for the parent set, if any. promo and token sets often have a parent set.
   */
  parent_set_code: ColumnType<string, string | undefined, string>;
  /**
   * The number of cards in this set.
   */
  card_count: ColumnType<number>;
  /**
   * The denominator for the set’s printed collector numbers.
   */
  printed_size: ColumnType<number>;
  /**
   * True if this set was only released in a video game.
   */
  digital: ColumnType<boolean, number, number>;
  /**
   * True if this set contains only foil cards.
   */
  foil_only: ColumnType<boolean, number, number>;
  /**
   * True if this set contains only nonfoil cards.
   */
  nonfoil_only: ColumnType<boolean, number, number>;
  /**
   * A link to this set’s permapage on Scryfall’s website.
   */
  scryfall_uri: ColumnType<string>;
  /**
   * A link to this set object on Scryfall’s API.
   */
  uri: ColumnType<string>;
  /**
   * A URI to an SVG file for this set’s icon on Scryfall’s CDN. Hotlinking this image isn’t recommended, because it may change slightly over time. You should download it and use it locally for your particular user interface needs.
   */
  icon_svg_uri: ColumnType<string>;
  /**
   * A Scryfall API URI that you can request to begin paginating over the cards in this set.
   */
  search_uri: ColumnType<string>;
};

export type CardSet = Selectable<CardSetTable>;
export type NewCardSet = Insertable<CardSetTable>;
export type UpdateCardSet = Updateable<CardSetTable>;
