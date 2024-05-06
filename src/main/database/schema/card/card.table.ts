import { ColumnType, Insertable, Selectable, Updateable } from "kysely";

import { CardLayout, MTGLanguage } from "../../../../common/enums";
import { SynchronizedWithStringId } from "../base.types";

// TODO consider cards with normal layout as card with a single face and store it like that
export interface CardTable extends SynchronizedWithStringId {
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

  //#region Gameplay Fields ---------------------------------------------------
  /**
   * The card’s mana value. Note that some funny cards have fractional mana costs.
   */
  cmc: number;

  /**
   * This face’s defense, if any.
   */
  defense?: string;

  /**
   * This card’s overall rank/popularity on EDHREC. Not all cards are ranked. (integer)
   */
  edhrec_rank?: number;

  /**
   * This card’s hand modifier, if it is Vanguard card. This value will contain a delta, such as -1.
   */
  hand_modfier?: string;

  /**
   * This card’s life modifier, if it is Vanguard card. This value will contain a delta, such as +2.
   */
  life_modfier?: string;

  /**
   * This loyalty if any. Note that some cards have loyalties that are not numeric, such as X.
   */
  loyalty?: string;

  /**
   * The mana cost for this card. This value will be any empty string "" if the cost is absent.
   * Remember that per the game rules, a missing mana cost and a mana cost of {0} are different values.
   * Multi-faced cards will report this value in card faces
   * __This is not correct when looking at the json.__
   */
  mana_cost?: string;

  /**
   * The name of this card. I
   * f this card has multiple faces, this field will contain both names separated by _//␣.
   */
  name: string;

  /**
   * The Oracle text for this card, if any.
   */
  //
  oracle_text?: string;

  /**
   * This card’s rank/popularity on Penny Dreadful. Not all cards are ranked.
   * (integer)
   */
  penny_rank?: number;

  /**
   * This card’s power, if any. Note that some cards have powers that are not numeric, such as *.
   */
  power?: string;

  /**
   * True if this card is on the Reserved List.
   */
  reserved: number;

  /**
   * This card’s toughness, if any. Note that some cards have toughnesses that are not numeric, such as *.
   */
  thoughness?: string;

  /**
   * The type line of this card.
   */
  type_line: string;
  //#endregion
}

export type Card = Selectable<CardTable>;
export type NewCard = Insertable<CardTable>;
export type UpdateCard = Updateable<CardTable>;
