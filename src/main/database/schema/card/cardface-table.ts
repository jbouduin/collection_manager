import { ColumnType, Insertable, Selectable, Updateable } from "kysely";

import { CardLayout } from "../../../../common/enums";
import { NonSynchronized, NonSynchronizedWithStringId, SynchronizedWithStringId } from "../base.types";

export interface CardFaceTable {

  id: ColumnType<string, string, never>;
  card_id: ColumnType<string, string, never>;
  // put (oracle card name here in case of single face card
  // otherwise put face name
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
   * An object providing URIs to imagery for this face,
   * if this is a double - sided card.If this card is not double - sided, then the image_uris property will be part of the parent object instead.
   */
  // table face_images image_uris 	Object 	Nullable

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
  oracle_id?: ColumnType<string | string | undefined>
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
}

export type CardFace = Selectable<CardFaceTable>;
export type InsertFace = Insertable<CardFaceTable>;
export type UpdateCardFace = Updateable<CardFaceTable>;
