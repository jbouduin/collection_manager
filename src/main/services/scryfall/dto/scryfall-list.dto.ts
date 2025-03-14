export interface IScryfallListDto<T extends object> {
  /**
   * An array of the requested objects, in a specific order.
   */
  data: Array<T>;
  /**
   * True if this List is paginated and there is a page beyond the current page.
   */
  has_more: boolean;
  /**
   * If there is a page beyond the current page, this field will contain a full API URI to that page. You may submit a HTTP GET request to that URI to continue paginating forward on this List.
   *
   * This is only defined when `has_more` is true.
   *
   * @type URI
   */
  next_page?: string;
  /**
   * If this is a list of Card objects, this field will contain the total number of cards found across all pages.
   * Otherwise this field will be undefined.
   *
   * @type Integer
   */
  total_cards?: number;
  /**
   * An array of human-readable warnings issued when generating this list, as strings.
   *
   * Warnings are non-fatal issues that the API discovered with your input.
   * In general, they indicate that the List will not contain the all of the information you requested.
   * You should fix the warnings and re-submit your request.
   */
  warnings?: Array<string>;
}
