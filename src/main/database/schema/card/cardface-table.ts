import { ColumnType } from "kysely";
import { CardLayout } from "../../../../common/types";

export interface CardfaceTable {
  card_id: ColumnType<string, string, never>;
  sequence: ColumnType<number, number, never>;
  // put (oracle card name here in case of single face card/ otherwise put face name
  face_name: ColumnType<string, string, never>;
  artist?: ColumnType<string, string | undefined>;
  cmc?: ColumnType<number, number | undefined>;
  /**
   * This face’s defense, if the game defines colors for the individual face of this card.
   */
  defense?: ColumnType<string, string | undefined>;
  /**
   * A unique identifier for the card face artwork that remains consistent across reprints.
   * Newly spoiled cards may not have this field yet.
   */
  illustration_id?: ColumnType<string, string | undefined>;
  /**
   * The layout of this card face, if the card is reversible.
   */
  layout?: ColumnType<CardLayout, CardLayout | undefined>;
  /**
   * This face’s loyalty, if any.
   */
  loyalty?: ColumnType<string, string | undefined>;
  /**
   * The mana cost for this face.
   * This value will be any empty string "" if the cost is absent.
   * Remember that per the game rules, a missing mana cost and a mana cost of {0} are different values.
   */
  mana_cost: ColumnType<string>;
  /**
   * The Oracle ID of this particular face, if the card is reversible.
   */
  oracle_id?: ColumnType<string, string, undefined>;
  /**
   * This face’s power, if any.
   * Note that some cards have powers that are not numeric, such as *.
   */
  power?: ColumnType<string, string | undefined>;
  toughness?: ColumnType<string, string | undefined>;
  /**
   * The watermark on this particulary card face, if any.
   */
  watermark?: ColumnType<string, string | undefined>;
  printed_name?: ColumnType<string, string | undefined>;
  printed_text?: ColumnType<string, string | undefined>;
  printed_type_line: ColumnType<string, string | undefined>;
  flavor_name?: ColumnType<string, string | undefined>;
  flavor_text?: ColumnType<string, string | undefined>;
}

/*
 * LATER store "hand_modfier?" (This card’s hand modifier, if it is Vanguard card. This value will contain a delta, such as -1.)
 * LATER store "life_modfier?" (This card’s life modifier, if it is Vanguard card. This value will contain a delta, such as +2.)
 */
