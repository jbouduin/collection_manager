import { CardLayout, MTGColor } from "../../../../../common/types";

export interface ScryfallCardface {
  /**
   * The colors in this card’s color indicator, if any. A null value for this field indicates the card does not have one.
   */
  color_indicator?: Array<MTGColor>;
  /**
   * Nullable 	The mana cost for this card. This value will be any empty string "" if the cost is absent. Remember that per the game rules, a missing mana cost and a mana cost of {0} are different  Multi-faced cards will report this value in card faces.
   */
  mana_cost?: string;
  /**
   * The name of this card.
   */
  name: string;
  /**
   * The type line of this card.
   */
  type_line: string;
  /**
   * The Oracle text for this card, if any.
   */
  oracle_text: string;
  /**
   * This card’s hand modifier, if it is Vanguard card. This value will contain a delta, such as -1.
   */
  hand_modifier?: string;
  /**
   * This card’s life modifier, if it is Vanguard card. This value will contain a delta, such as +2.
   */
  life_modifier?: string;
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
   * The name of the illustrator of this card face. Newly spoiled cards may not have this field yet.
   */
  artist?: string;
  /**
   * The ID of the illustrator of this card face. Newly spoiled cards may not have this field yet.
   *
   * @type UUID
   */
  artist_id?: string;
  /**
   * A unique identifier for the card face artwork that remains consistent across reprints. Newly spoiled cards may not have this field yet.
   *
   * @type UUID
   */
  illustration_id?: string;
  /**
   * This card’s colors, if the overall card has colors defined by the rules. Otherwise the colors will be on the card_faces objects.
   */
  colors: Array<MTGColor>;
  /**
   * The card’s mana value. Note that some funny cards have fractional mana costs.
   *
   * @type Decimal
   */
  cmc: number;
  /**
   * A unique ID for this card’s oracle identity.
   * This value is consistent across reprinted card editions, and unique among different cards with the same name (tokens, Unstable variants, etc).
   * Always present except for the reversible_card layout where it will be absent; oracle_id will be found on each face instead.
   *
   * @type UUID
   */
  oracle_id: string;
  /**
   * A code for this card’s layout.
   *
   * @see {@link https://scryfall.com/docs/api/layouts}
   */
  layout: CardLayout;
}
