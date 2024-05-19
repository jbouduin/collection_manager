import { RulingSource } from "../../../../../common/enums";

export interface ScryfallRuling  {
  /**
   * The Oracle ID of the card this ruling is associated with.
   *
   * @type UUID
   */
  oracle_id: string;
  /**
   * A computer-readable string indicating which company produced this ruling, either `wotc` or `scryfall`
   */
  source: RulingSource;
  /**
   * The date when the ruling or note was published
   *
   * @type IsoDate
   */
  published_at: string;
  /**
   * The text of the ruling
   */
  comment: string;
}
