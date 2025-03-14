export interface IScryfallCatalogDto {
  /**
   * A link to the current catalog on Scryfall’s API
   *
   * @type string
   */
  uri: string;
  /**
   * The number of items in the `data` array
   *
   * @type Integer
   */
  total_values: number;
  /**
   * An array of catalog items (strings)
   */
  data: Array<string>;
}
