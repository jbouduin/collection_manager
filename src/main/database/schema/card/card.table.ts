import { ColumnType } from "kysely";

import { CardBorderColor, CardFrame, CardLayout, CardRarity, MTGLanguage } from "../../../../common/enums";
import { SynchronizedWithStringId } from "../base.types";

export interface CardTable extends SynchronizedWithStringId {
  lang: ColumnType<MTGLanguage, MTGLanguage | undefined, never>;
  name: ColumnType<string, string | undefined>;
  oracle_id?: ColumnType<string, string | undefined>;
  set_id: ColumnType<string>;
  collector_number: ColumnType<string, string, string | undefined>;
  released_at: ColumnType<Date, string, string>; // LATER check if this is always the same as the set release date
  rarity: ColumnType<CardRarity>;
  layout: ColumnType<CardLayout, CardLayout>;
  scryfall_uri: ColumnType<string>;
  booster: ColumnType<boolean, number, number>;
  border: ColumnType<CardBorderColor>;
  card_back_id: ColumnType<string>;
  content_warning: ColumnType<boolean, number, number>;
  digital: ColumnType<boolean, number, number>;
  full_art: ColumnType<boolean, number, number>;
  reprint: ColumnType<boolean, number, number>;
  frame: ColumnType<CardFrame, string>;
  // LATER store property "finishes" in a table (An array of computer - readable flags that indicate if this card can come in foil, nonfoil, or etched finishes.)
}



// export interface OldCardTable extends SynchronizedWithStringId {
//   //#region Core fields -------------------------------------------------------
//   /**
//    * A link to where you can begin paginating all re/prints for this card on Scryfall’s API.
//    */
//   prints_search_uri: ColumnType<string>;
//   //#endregion Core Fields

//   //#region Vendor references -------------------------------------------------
//   /**
//      * This card’s Arena ID, if any. A large percentage of cards are not available on Arena and do not have this ID.
//      */
//   arena_id?: ColumnType<number, number | undefined, number>;

//   /**
//    * This card’s Magic Online ID (also known as the Catalog ID), if any. A large percentage of cards are not available on Magic Online and do not have this ID.
//    */
//   mtgo_id?: ColumnType<number, number | undefined, number>;

//   /**
//    * This card’s foil Magic Online ID (also known as the Catalog ID), if any. A large percentage of cards are not available on Magic Online and do not have this ID.
//    */
//   mtgo_foil_id?: ColumnType<number, number | undefined, number>;

//   /**
//    * This card’s ID on TCGplayer’s API, also known as the productId.
//    */
//   tcgplayer_id?: ColumnType<number, number | undefined, number>;

//   /**
//    * This card’s ID on TCGplayer’s API, for its etched version if that version is a separate product.
//    */
//   tcgplayer_etched_id?: ColumnType<number, number | undefined, number>;

//   /**
//    * This card’s ID on Cardmarket’s API, also known as the idProduct.
//    */
//   cardmarket_id?: ColumnType<number, number | undefined, number>;
//   //#endregion

//   //#region Gameplay Fields ---------------------------------------------------
//   /**
//    * The card’s mana value. Note that some funny cards have fractional mana costs.
//    */
//   cmc: ColumnType<number>;

//   /**
//    * This face’s defense, if any.
//    */
//   defense?: ColumnType<string, string | undefined>;

//   /**
//    * This card’s overall rank/popularity on EDHREC. Not all cards are ranked. (integer)
//    */
//   edhrec_rank?: ColumnType<number, number | undefined>;

//   /**
//    * This card’s hand modifier, if it is Vanguard card. This value will contain a delta, such as -1.
//    */
//   hand_modfier?: ColumnType<string, string | undefined>;

//   /**
//    * This card’s life modifier, if it is Vanguard card. This value will contain a delta, such as +2.
//    */
//   life_modfier?: ColumnType<string, string | undefined>;

//   /**
//    * This loyalty if any. Note that some cards have loyalties that are not numeric, such as X.
//    */
//   loyalty?: ColumnType<string, string | undefined>;

//   /**
//    * This card’s rank/popularity on Penny Dreadful. Not all cards are ranked.
//    * (integer)
//    */
//   penny_rank?: ColumnType<number>;

//   /**
//    * This card’s power, if any. Note that some cards have powers that are not numeric, such as *.
//    */
//   power?: ColumnType<string, string | undefined>;

//   /**
//    * True if this card is on the Reserved List.
//    */
//   reserved: ColumnType<boolean, number, number>;

//   /**
//    * This card’s toughness, if any. Note that some cards have toughnesses that are not numeric, such as *.
//    */
//   thoughness?: ColumnType<string, string | undefined>;
//   //#endregion

//   //#region Print fields ------------------------------------------------------
//   /**
//    * The name of the illustrator of this card. Newly spoiled cards may not have this field yet.
//   */
//   artist?: ColumnType<string, string | undefined>;
//   // LATER store artists in artist table, makes previous field redundant
//   // artist_ids  = The IDs of the artists that illustrated this card. Newly spoiled cards may not have this field yet.

//   // FEATURE store property "attraction_lights" in a table: The lit Unfinity attractions lights array on this card, if any.
//   // LATER store property "frame_effects": Array of This card’s frame effects, if any.Will make some other properties redundant I suppose

//   /**
//    * True if this card’s imagery is high resolution.
//    */
//   highres_image: ColumnType<boolean, number, number>;

//   /**
//    * A unique identifier for the card artwork that remains consistent across reprints.
//    * Newly spoiled cards may not have this field yet.
//    */
//   illustration_id?: ColumnType<string, string | undefined>;

//   /**
//    * A computer - readable indicator for the state of this card’s image, one of missing, placeholder, lowres, or highres_scan.
//    */
//   // FEATURE store imagestatus and allow resync of those who have no high-res
//   image_status: ColumnType<ImageStatus>;

//   /**
//    * True if this card is oversized.
//    */
//   oversized: ColumnType<boolean, number, number>;

//   // FEATURE store "prices" in a table
//   // An object containing daily price information for this card, including usd, usd_foil, usd_etched, eur, eur_foil, eur_etched, and tix prices, as strings.


//   /**
//    * True if this card is a promotional print.
//    */
//   promo: ColumnType<boolean, number, number>;

//   // LATER store promo_types in a table
//   // An array of strings describing what categories of promo cards this card falls into.

//   // FEATURE store "purchase_uris" in a table
//   // An object providing URIs to this card’s listing on major marketplaces.Omitted if the card is unpurchaseable.

//   /**
//    * This card’s rarity.One of common, uncommon, rare, special, mythic, or bonus.
//    */

//   // FEATURE store "related_uris" in a table
//   // An object providing URIs to this card’s listing on other Magic: The Gathering online resources.
//   /**
//    * True if this card is a Story Spotlight.
//    */
//   story_spotlight: ColumnType<boolean, number, number>;


//   /**
//    * Whether this card is a variation of another printing.
//    */
//   // redundant ? if variation_of has a value, this one is true
//   variation: ColumnType<boolean, number, number>;

//   /**
//    * The printing ID of the printing this card is a variation of.
//   */
//   variation_of?: ColumnType<string, string | undefined>;

//   /**
//    * The security stamp on this card, if any.One of oval, triangle, acorn, circle, arena, or heart.
//    */
//   security_stamp?: ColumnType<CardSecurityStamp, CardSecurityStamp | undefined>;

//   /**
//    * This card’s watermark, if any.
//    */
//   watermark?: ColumnType<string, string | undefined>;


//   //#endregion
// }
