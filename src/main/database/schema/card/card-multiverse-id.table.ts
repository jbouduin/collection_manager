import { ColumnType, Insertable, Selectable, Updateable } from "kysely";

import { NonSynchronized } from "../base.types";

export interface CardMultiverseIdTable extends NonSynchronized {
  card_id: ColumnType<string, string, never>;
  /**
   * This card’s multiverse IDs on Gatherer, if any, as an array of integers. Note that Scryfall includes many promo cards, tokens, and other esoteric objects that do not have these identifiers.
   */
  multiverse_id: ColumnType<number, number, never>;
}
