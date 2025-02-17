//#region Scryfall fields -----------------------------------------------------
export type ImageSize =
  "small" |
  "normal" |
  "large" |
  "png" |
  "art_crop" |
  "border_crop";
export type ImageStatus =
  "missing" |
  "placeholder" |
  "lowres" |
  "highres_scan";
export type RulingSource = "wotc" | "scryfall";
//#endregion

//#region Scryfall sync -------------------------------------------------------
export type CardSyncType =
  "none" |
  "allCards" |
  "byCardSet" |
  "byImageStatus" |
  "byLastSynchronized" |
  "collection";
// FEATURE  bulk
export type ChangedImageStatusAction = "delete" | "replace";
export type RulingSyncType =
  "none" |
  "update" |
  "all" |
  "selectionOfCards";
// FEATURE byLastSynchronized
export type ScryfallEndpoint =
  "cards" |
  "cardSet" |
  "cardSymbol" |
  "catalog" |
  "collection" |
  "ruling" |
  "search";
export type TimespanUnit = "day" | "week" | "month" | "year";
//#endregion
