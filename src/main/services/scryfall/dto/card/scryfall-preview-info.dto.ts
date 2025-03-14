export interface IScryfallPreviewInfoDto {
  /**
   * The date this card was previewed.
   *
   * @type IsoDate
   */
  previewed_at: string;
  /**
   * A link to the preview for this card.
   *
   * @type URI
   */
  source_uri: string;
  /**
   * The name of the source that previewed this card.
   */
  source: string;
}
