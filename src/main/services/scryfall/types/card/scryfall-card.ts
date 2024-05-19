import { CardBorderColor, CardFinish, CardFrame, CardFrameEffect, CardLayout, CardLegality, CardPromoType, CardRarity, CardSecurityStamp, CardSetType, Game, GameFormat, ImageSize, ImageStatus, MTGColor, MTGLanguage } from "../../../../../common/enums";
import { ScryfallCardFace } from "./scryfall-card-face";
import { ScryfallPreviewInfo } from "./scryfall-preview-info";
import { ScryfallRelatedCard } from "./scryfall-related-card";
import { ScryfallPrices } from "./scryfall-prices";
import { ScryfallPurchaseUris } from "./scryfall-purchase-uris";
import { ScryfallRelatedUris } from "./scryfall-related-uris";

export interface ScryfallCard {

  //#region Core fields -------------------------------------------------------
  /**
   * A unique ID for this card in Scryfall’s database.
   *
   * @type UUID
   */
  id: string;
  /**
   * A unique ID for this card’s oracle identity.
   * This value is consistent across reprinted card editions, and unique among different cards with the same name (tokens, Unstable variants, etc).
   * Always present except for the reversible_card layout where it will be absent; oracle_id will be found on each face instead.
   *
   * @type UUID
   */
  oracle_id: string;
  /**
   * A language code for this printing.
   */
  lang: MTGLanguage;
  /**
   * A code for this card’s layout.
   *
   * @see {@link https://scryfall.com/docs/api/layouts}
   */
  layout: CardLayout;
  /**
   * A link to where you can begin paginating all re/prints for this card on Scryfall’s API.
   *
   * @type URI
   */
  prints_search_uri: string;
  /**
   * A link to this card’s rulings list on Scryfall’s API.
   *
   * @type URI
   */
  rulings_uri: string;
  /**
   * A link to this card’s permapage on Scryfall’s website.
   *
   * @type URI
   */
  scryfall_uri: string;
  /**
   * A link to this card object on Scryfall’s API.
   *
   * @type URI
   */
  uri: string;
  //#endregion

  //#region Vendor references -------------------------------------------------
  /**
     * This card’s Arena ID, if any. A large percentage of cards are not available on Arena and do not have this ID.
     *
     * @type Integer
     */
  arena_id?: number;
  /**
   * This card’s Magic Online ID (also known as the Catalog ID), if any. A large percentage of cards are not available on Magic Online and do not have this ID.
   *
   * @type Integer
   */
  mtgo_id?: number;
  /**
   * This card’s foil Magic Online ID (also known as the Catalog ID), if any. A large percentage of cards are not available on Magic Online and do not have this ID.
   *
   * @type Integer
   */
  mtgo_foil_id?: number;
  /**
   * This card’s multiverse IDs on Gatherer, if any, as an array of integers. Note that Scryfall includes many promo cards, tokens, and other esoteric objects that do not have these identifiers.
   *
   * @type Integer
   */
  multiverse_ids?: Array<number>;
  /**
   * This card’s ID on TCGplayer’s API, also known as the productId.
   *
   * @type Integer
   */
  tcgplayer_id?: number;
  /**
   * This card’s ID on TCGplayer’s API, for its etched version if that version is a separate product.
   *
   * @type Integer
   */
  tcgplayer_etched_id?: number;
  /**
   * This card’s ID on Cardmarket’s API, also known as the idProduct.
   *
   * @type Integer
   */
  cardmarket_id?: number;
  //#endregion

  //#region Gameplay fields ---------------------------------------------------
  /**
   * If this card is closely related to other cards, this property will be an array with Related Card Objects.
   */
  all_parts?: Array<ScryfallRelatedCard>;
  /**
   * An object describing the legality of this card across play formats. Possible legalities are legal, not_legal, restricted, and banned.
   */
  legalities: Record<GameFormat, CardLegality>;
  /**
   * An array of Card Face objects, if this card is multifaced.
   */
  card_faces: Array<ScryfallCardFace>;

  //#region Vanguard stats ----------------------------------------------------
  /**
   * This card’s hand modifier, if it is Vanguard card. This value will contain a delta, such as -1.
   */
  hand_modifier?: string;
  /**
   * This card’s life modifier, if it is Vanguard card. This value will contain a delta, such as +2.
   */
  life_modifier?: string;
  //#endregion

  //#region Combat stats  -----------------------------------------------------
  /**
   * This card's defense, if any.
   */
  defense?: string;
  /**
   * This loyalty if any. Note that some cards have loyalties that are not numeric, such as X.
   */
  loyalty?: string;
  /**
   * This card’s power, if any. Note that some cards have powers that are not numeric, such as `"*"`.
   */
  power?: string;
  /**
   * This card’s toughness, if any. Note that some cards have toughnesses that are not numeric, such as `"*"`.
   */
  toughness?: string;
  //#endregion


  /**
   * The colors in this card’s color indicator, if any. A null value for this field indicates the card does not have one.
   */
  color_indicator?:Array< MTGColor>;
  /**
   * Nullable 	The mana cost for this card. This value will be any empty string "" if the cost is absent. Remember that per the game rules, a missing mana cost and a mana cost of {0} are different  Multi-faced cards will report this value in card faces.
   */
  mana_cost?: string;
  /**
   * The Oracle text for this card, if any.
   */
  oracle_text: string;



  /**
   * The card’s mana value. Note that some funny cards have fractional mana costs.
   *
   * @type Decimal
   */
  cmc: number;
  /**
     * This card’s colors, if the overall card has colors defined by the rules. Otherwise the colors will be on the card_faces objects.
     */
  colors: Array<MTGColor>;
  /**
   * This card’s color identity.
   */
  color_identity: Array<MTGColor>;
  /**
   * This card’s overall rank/popularity on EDHREC. Not all cards are ranked.
   *
   * @type Integer
   */
  edhrec_rank?: number;
  /**
   * An array of keywords that this card uses, such as 'Flying' and 'Cumulative upkeep'.
   */
  keywords: Array<string>;
  /**
   * The name of this card. If this card has multiple faces, this field will contain both names separated by ␣//␣.
   */
  name: string;
  /**
   * This card’s rank/popularity on Penny Dreadful. Not all cards are ranked.
   *
   * @type Integer
   */
  penny_rank?: number;
  /**
   * Colors of mana that this card could produce.
   */
  produced_mana?: MTGColor;
  /**
   * True if this card is on the Reserved List.
   */
  reserved: boolean;
  /**
   * The type line of this card.
   */
  type_line: string;

  //#region print info --------------------------------------------------------
  /**
     * The name of the illustrator of this card. Newly spoiled cards may not have this field yet.
     */
  artist?: string;
  /**
   * The IDs of the artists that illustrated this card. Newly spoiled cards may not have this field yet.
   *
   * @type UUID
   */
  artist_ids?: Array<string>;
  /**
   * The lit Unfinity attractions lights on this card, if any.
   *
   * This will be an array of numbers ranging from 1 to 6 inclusive.
   */
  attraction_lights?: Array<number>;
  /**
   * Whether this card is found in boosters.
   */
  booster: boolean;
  /**
   * This card’s border color: black, white, borderless, silver, or gold.
   */
  border_color: CardBorderColor;
  /**
   * This card’s collector number. Note that collector numbers can contain non-numeric characters, such as letters or ★.
   */
  collector_number: string;
  /**
   * True if you should consider avoiding use of this print downstream.
   */
  content_warning?: boolean;
  /**
   * True if this card was only released in a video game.
   */
  digital: boolean;
  /**
   * An array of computer-readable flags that indicate if this card can come in foil, nonfoil, or etched finishes.
   */
  finishes: Array<CardFinish>;
  /**
   * This card’s frame effects, if any.
   */
  frame_effects?: Array<CardFrameEffect>;
  /**
   * This card’s frame layout.
   */
  frame: CardFrame;
  /**
   * True if this card’s artwork is larger than normal.
   */
  full_art: boolean;
  /**
   * A list of games that this card print is available in, paper, arena, and/or mtgo.
   */
  games: Array<Game>;
  /**
   * True if this card’s imagery is high resolution.
   */
  highres_image: boolean;
  /**
   * A unique identifier for the card artwork that remains consistent across reprints. Newly spoiled cards may not have this field yet.
   *
   * @type UUID
   */
  illustration_id?: string;
  /**
   * A computer-readable indicator for the state of this card’s image, one of missing, placeholder, lowres, or highres_scan.
   */
  image_status: ImageStatus;
  /**
   * True if this card is oversized.
   */
  oversized: boolean;
  /**
   * An object containing daily price information for this card, including usd, usd_foil, usd_etched, eur, eur_foil, eur_etched, and tix prices, as strings.
   */
  prices: ScryfallPrices;
  /**
   * True if this card is a promotional print.
   */
  promo: boolean;
  /**
   * An array of strings describing what categories of promo cards this card falls into.
   */
  promo_types?: Array<CardPromoType>;
  /**
   * An object providing URIs to this card’s listing on major marketplaces. Omitted if the card is unpurchaseable.
   */
  purchase_uris?: ScryfallPurchaseUris;
  /**
   * This card’s rarity.
   */
  rarity: CardRarity;
  /**
   * An object providing URIs to this card’s listing on other Magic: The Gathering online resources.
   */
  related_uris: ScryfallRelatedUris;
  /**
   * The date this card was first released.
   *
   * @type IsoDate
   */
  released_at: string;
  /**
   * True if this card is a reprint.
   */
  reprint: boolean;
  /**
   * A link to this card’s set on Scryfall’s website.
   *
   * @type URI
   */
  scryfall_set_uri: string;
  /**
   * This card’s full set name.
   */
  set_name: string;
  /**
   * A link to where you can begin paginating this card’s set on the Scryfall API.
   *
   * @type URI
   */
  set_search_uri: string;
  /**
   * The type of set this printing is in.
   */
  set_type: CardSetType;
  /**
   * A link to this card’s set object on Scryfall’s API.
   *
   * @type URI
   */
  set_uri: string;
  /**
   * This card’s set code.
   */
  set: string;
  /**
   * This card’s Set object UUID.
   *
   * @type UUID
   */
  set_id: string;
  /**
   * True if this card is a Story Spotlight.
   */
  story_spotlight: boolean;
  /**
   * True if the card is printed without text.
   */
  textless: boolean;
  /**
   * The security stamp on this card, if any.
   */
  security_stamp?: CardSecurityStamp;
  /**
   * Preview information for this print, if any.
   */
  preview?: ScryfallPreviewInfo;

  /**
   * The Scryfall ID for the card back design present on this card. Only for single sided cards
   *
   * @type UUID
   */
  card_back_id: string;

  /**
   * An object listing available imagery for this card. See the Card Imagery article for more information.
   */
  // NOW create a type for those Record<x,y> properties
  image_uris?: Record<ImageSize, string>;

  /**
   * The just-for-fun name printed on the card (such as for Godzilla series cards).
   */
  flavor_name?: string;
  /**
   * The flavor text, if any.
   */
  flavor_text?: string;
  /**
   * This card’s watermark, if any.
   */
  watermark?: string;

  /**
   * The ID of the illustrator of this card face. Newly spoiled cards may not have this field yet.
   *
   * @type UUID
   */
  artist_id?: string;

  /**
   * The localized name printed on this card, if any.
   */
  printed_name?: string;
  /**
   * The localized text printed on this card, if any.
   */
  printed_text?: string;
  /**
   * The localized type line printed on this card, if any.
   */
  printed_type_line?: string;
  /**
   * Whether this card is a variation of another printing.
   */
  variation: boolean;
  /**
   * The printing ID of the printing this card is a variation of.
   *
   * This will only exist if the `variation` field is true.
   *
   * @type UUID
   */
  variation_of?: string;
  //#endregion

  //#endregion
}
