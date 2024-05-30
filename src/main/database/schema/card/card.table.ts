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
  card_back_id: ColumnType<string, string | undefined>;
  content_warning: ColumnType<boolean, number, number>;
  digital: ColumnType<boolean, number, number>;
  full_art: ColumnType<boolean, number, number>;
  reprint: ColumnType<boolean, number, number>;
  frame: ColumnType<CardFrame, string>;
}

// LATER store property "finishes" in a table (An array of computer - readable flags that indicate if this card can come in foil, nonfoil, or etched finishes.)
// LATER prints_search_uri (A link to where you can begin paginating all re/prints for this card on Scryfall’s API.)
// LATER store property "frame_effects": Array of This card’s frame effects, if any.Will make some other properties redundant I suppose
// LATER reserved (True if this card is on the Reserved List.) => whatever that means
// LATER oversized: ColumnType<boolean, number, number>;
// LATER promo: ColumnType<boolean, number, number>;
// LATER store promo_types in a table (An array of strings describing what categories of promo cards this card falls into.)
// LATER story_spotlight (True if this card is a Story Spotlight.)
// LATER variation (Whether this card is a variation of another printing.) => redundant ? if variation_of has a value, this one is true
// LATER variation_of? (The printing ID of the printing this card is a variation of.)
// LATER security_stamp?: (The security stamp on this card, if any.One of oval, triangle, acorn, circle, arena, or heart.)
// FEATURE store property "attraction_lights" in a table: The lit Unfinity attractions lights array on this card, if any.
// FEATURE store imagestatus (one of missing, placeholder, lowres, or highres_scan) and allow resync of those who have no high-res
// FEATURE store "prices" in a table (after implementing collection)
// FEATURE store "purchase_uris" in a table
