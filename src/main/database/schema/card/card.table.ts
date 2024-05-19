import { ColumnType, Insertable, Selectable, Updateable } from "kysely";

import { CardBorderColor, CardFrame, CardLayout, CardRarity, ImageStatus, MTGLanguage } from "../../../../common/enums";
import { SynchronizedWithStringId } from "../base.types";
import { CardSecurityStamp } from "scryfall-sdk";

export interface CardTable extends SynchronizedWithStringId {
  //#region Core fields -------------------------------------------------------
  /**
   * A unique ID for this card’s oracle identity.
   * This value is consistent across reprinted card editions, and unique among different cards with the same name (tokens, Unstable variants, etc).
   * Always present except for the reversible_card layout where it will be absent; oracle_id will be found on each face instead.
   */
  oracle_id?: ColumnType<string, string | undefined>;

  /**
   * A language code for this printing.
   */
  lang: ColumnType<MTGLanguage, MTGLanguage, never>;

  /**
   * A code for this card’s layout.
   */
  layout: ColumnType<CardLayout, CardLayout>;

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
  cmc: ColumnType<number>;

  /**
   * This face’s defense, if any.
   */
  defense?: ColumnType<string, string | undefined>;

  /**
   * This card’s overall rank/popularity on EDHREC. Not all cards are ranked. (integer)
   */
  edhrec_rank?: ColumnType<number, number | undefined>;

  /**
   * This card’s hand modifier, if it is Vanguard card. This value will contain a delta, such as -1.
   */
  hand_modfier?: ColumnType<string, string | undefined>;

  /**
   * This card’s life modifier, if it is Vanguard card. This value will contain a delta, such as +2.
   */
  life_modfier?: ColumnType<string, string | undefined>;

  /**
   * This loyalty if any. Note that some cards have loyalties that are not numeric, such as X.
   */
  loyalty?: ColumnType<string, string | undefined>;

  /**
   * The mana cost for this card. This value will be any empty string "" if the cost is absent.
   * Remember that per the game rules, a missing mana cost and a mana cost of {0} are different values.
   * Multi-faced cards will report this value in card faces
   * __REMARK: This is not correct when looking at the json it contains both values for split cards.__
   * __REMARK: why is this nullable???
   */
  mana_cost?: ColumnType<string, string | undefined>;

  /**
   * The name of this card.
   * If this card has multiple faces, this field will contain both names separated by _//␣.
   */
  name: ColumnType<string>;

  /**
   * The Oracle text for this card, if any.
   */
  //
  oracle_text?: ColumnType<string, string | undefined>;

  /**
   * This card’s rank/popularity on Penny Dreadful. Not all cards are ranked.
   * (integer)
   */
  penny_rank?: ColumnType<number>;

  /**
   * This card’s power, if any. Note that some cards have powers that are not numeric, such as *.
   */
  power?: ColumnType<string, string | undefined>;

  /**
   * True if this card is on the Reserved List.
   */
  reserved: ColumnType<boolean, number, number>;

  /**
   * This card’s toughness, if any. Note that some cards have toughnesses that are not numeric, such as *.
   */
  thoughness?: ColumnType<string, string | undefined>;

  /**
   * The type line of this card.
   */
  type_line: ColumnType<string>;
  //#endregion

  //#region Print fields ------------------------------------------------------
  /**
   * The name of the illustrator of this card. Newly spoiled cards may not have this field yet.
  */
  artist?: ColumnType<string, string | undefined>;

  // LATER store artists in artist table, makes previous field redundant
  // artist_ids  = The IDs of the artists that illustrated this card. Newly spoiled cards may not have this field yet.

  // FEATURE store property "attraction_lights" in a table: The lit Unfinity attractions lights array on this card, if any.

  /**
   * Whether this card is found in boosters.
   */
  booster: ColumnType<boolean, number, number>;

  /**
   * This card’s border color: black, white, borderless, silver, or gold.
   */
  border: ColumnType<CardBorderColor>;

  /**
   * The Scryfall ID for the card back design present on this card.
   */
  card_back_id: ColumnType<string>;

  /**
   * This card’s collector number. Note that collector numbers can contain non-numeric characters, such as letters or ★.
   */
  collector_number: ColumnType<string>

  /**
   * True if you should consider avoiding use of this print downstream.
   * Scryfall has it optional
   */
  content_warning: ColumnType<boolean, number, number>;

  /**
   * True if this card was only released in a video game.
   */
  digital: ColumnType<boolean, number, number>;

  // LATER store property "finishes" in a table
  // An array of computer - readable flags that indicate if this card can come in foil, nonfoil, or etched finishes.

  /**
   * The just -for-fun name printed on the card(such as for Godzilla series cards).
   */
  flavor_name?: ColumnType<string, string | undefined>;

  /**
   * The flavor text, if any.
   */
  flavor_text?: ColumnType<string, string | undefined>;

  // LATER store property "frame_effects": Array of This card’s frame effects, if any.Will make some other properties redundant I suppose

  /**
   * This card’s frame layout.
   */
  frame: ColumnType<CardFrame, string>;

  /**
   * True if this card’s artwork is larger than normal.
   * */
  full_art: ColumnType<boolean, number, number>;

  /**
   * True if this card’s imagery is high resolution.
   */
  highres_image: ColumnType<boolean, number, number>;

  /**
   * A unique identifier for the card artwork that remains consistent across reprints.
   * Newly spoiled cards may not have this field yet.
   */
  illustration_id?: ColumnType<string, string | undefined>;

  /**
   * A computer - readable indicator for the state of this card’s image, one of missing, placeholder, lowres, or highres_scan.
   */
  // LATER makes highres_image property probably redundant ???
  image_status: ColumnType<ImageStatus>;

  /**
   * True if this card is oversized.
   */
  oversized: ColumnType<boolean, number, number>;

  // FEATURE store "prices" in a table
  // An object containing daily price information for this card, including usd, usd_foil, usd_etched, eur, eur_foil, eur_etched, and tix prices, as strings.

  /**
   * The localized name printed on this card, if any.
   */
  printed_name?: ColumnType<string, string | undefined>;

  /**
   * The localized text printed on this card, if any.
   */
  printed_text?: ColumnType<string, string | undefined>;

  /**
   * The localized type line printed on this card, if any.
   */
  printed_type_line: ColumnType<string, string | undefined>;

  /**
   * True if this card is a promotional print.
   */
  promo: ColumnType<boolean, number, number>;

  // LATER store promo_types in a table
  // An array of strings describing what categories of promo cards this card falls into.

  // FEATURE store "purchase_uris" in a table
  // An object providing URIs to this card’s listing on major marketplaces.Omitted if the card is unpurchaseable.

  /**
   * This card’s rarity.One of common, uncommon, rare, special, mythic, or bonus.
   */
  rarity: ColumnType<CardRarity>;
  // FEATURE store "related_uris" in a table
  // An object providing URIs to this card’s listing on other Magic: The Gathering online resources.

  /**
   * The date this card was first released.
   */
  released_at: ColumnType<Date, string, string>

  /**
   * True if this card is a reprint.
   */
  reprint: ColumnType<boolean, number, number>;

  // not required scryfall_set_uri: string 		A link to this card’s set on Scryfall’s website.
  // not required set_name: 	String 		This card’s full set name.
  // not required set_search_uri: 	string 		A link to where you can begin paginating this card’s set on the Scryfall API.
  // not requiredset_type: 	String 		The type of set this printing is in.
  // not requiredset_uri: 	String 		A link to this card’s set object on Scryfall’s API.
  // not requiredset: 	String 		This card’s set code.

  /**
   * This card’s Set object UUID.
   */
  set_id: ColumnType<string>;

  /**
   * True if this card is a Story Spotlight.
   */
  story_spotlight: ColumnType<boolean, number, number>;

  /**
   * True if the card is printed without text.
   */
  // LATER redundant ? if there is no text then the card is textless
  textless: ColumnType<boolean, number, number>;

  /**
   * Whether this card is a variation of another printing.
   */
  // LATER redundant ? if variation_of has a value, this one is true
  variation: ColumnType<boolean, number, number>;

  /**
   * The printing ID of the printing this card is a variation of.
  */
  variation_of?: ColumnType<string, string | undefined>;

  /**
   * The security stamp on this card, if any.One of oval, triangle, acorn, circle, arena, or heart.
   */
  security_stamp?: ColumnType<CardSecurityStamp, CardSecurityStamp | undefined>;

  /**
   * This card’s watermark, if any.
   */
  watermark?: ColumnType<string, string | undefined>;

  // FEATURE store "preview fields". (Meaning is unclear)
  // preview.previewed_at 	Date 	Nullable 	The date this card was previewed.
  // preview.source_uri 	URI 	Nullable 	A link to the preview for this card.
  // preview.source 	String 	Nullable 	The name of the source that previewed this card.
  //#endregion
}

export type Card = Selectable<CardTable>;
export type NewCard = Insertable<CardTable>;
export type UpdateCard = Updateable<CardTable>;
