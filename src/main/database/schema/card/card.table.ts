import { ColumnType } from "kysely";

import { CardBorderColor, CardFrame, CardLayout, CardRarity, CardSecurityStamp, ImageStatus, MTGLanguage } from "../../../../common/enums";
import { SynchronizedWithStringId } from "../base.types";

export interface CardTable extends SynchronizedWithStringId {
  lang: ColumnType<MTGLanguage, MTGLanguage | undefined, never>;
  name: ColumnType<string, string | undefined>;
  oracle_id?: ColumnType<string, string | undefined>;
  set_id: ColumnType<string>;
  collector_number: ColumnType<string, string, string | undefined>;
  released_at: ColumnType<Date, string, string>;
  rarity: ColumnType<CardRarity>;
  layout: ColumnType<CardLayout, CardLayout>;
  scryfall_uri: ColumnType<string>;
  is_booster: ColumnType<boolean, number, number>;
  border: ColumnType<CardBorderColor>;
  card_back_id: ColumnType<string, string | undefined>;
  is_content_warning: ColumnType<boolean, number, number>;
  is_digital: ColumnType<boolean, number, number>;
  is_full_art: ColumnType<boolean, number, number>;
  is_reprint: ColumnType<boolean, number, number>;
  frame: ColumnType<CardFrame, string>;
  is_oversized: ColumnType<boolean, number, number>;
  is_reserved: ColumnType<boolean, number, number>;
  is_promo: ColumnType<boolean, number, number>;
  security_stamp?: ColumnType<CardSecurityStamp, CardSecurityStamp | undefined>;
  image_status: ColumnType<ImageStatus, ImageStatus>;
  is_story_spotlight: ColumnType<boolean, number, number>;
  is_variation: ColumnType<boolean, number, number>;
}

// NOT prints_search_uri (A link to where you can begin paginating all re/prints for this card on Scryfall’s API.):
// link is like "https://api.scryfall.com/cards/search?order=released&q=oracleid%3Aaa454a53-859c-4d54-b3e1-3764f67c00ff&unique=prints",

// LATER store "finishes" in a table (An array of computer - readable flags that indicate if this card can come in foil, nonfoil, or etched finishes.)
// LATER store "frame_effects": Array of This card’s frame effects, if any.Will make some other properties redundant I suppose
// LATER store "promo_types" in a table (An array of strings describing what categories of promo cards this card falls into.)

// LATER store "variation_of?" (The printing ID of the printing this card is a variation of.)
// LATER store "attraction_lights" in a table: The lit Unfinity attractions lights array on this card, if any.
// LATER store "prices" in a table (probably after implementing collection)
// LATER store "purchase_uris" in a table
