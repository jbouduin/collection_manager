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
  "collection" |
  "bulk";
// TODO cards I own
export type ChangedImageStatusAction = "delete" | "replace";

export type RulingSyncType =
  "none" |
  "update" |
  "all" |
  "selectionOfCards" |
  "oracleId";
// FEATURE byLastSynchronized

export type ScryfallEndpoint =
  "bulk" |
  "cards" |
  "cardSet" |
  "cardSymbol" |
  "catalog" |
  "collection" |
  "ruling" |
  "search";

export type TimespanUnit = "day" | "week" | "month" | "year";

export enum ECatalogType {
  "card-names",
  "artist-names",
  "word-bank",
  supertypes,
  "card-types",
  "artifact-types",
  "battle-types",
  "creature-types",
  "enchantment-types",
  "land-types",
  "planeswalker-types",
  "spell-types",
  powers,
  toughnesses,
  loyalties,
  "keyword-abilities",
  "keyword-actions",
  "ability-words",
  "flavor-words",
  watermarks
}
export type CatalogType = keyof typeof ECatalogType;
//#endregion
