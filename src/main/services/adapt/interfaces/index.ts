export * from "./card-set.adapter";
export * from "./card.adapter";
export * from "./catalog.adapter";
export * from "./symbology.adapter";
export * from "./symbology-alternative.adapter";
export * from "./symbology-color-map.adapter";

const ADAPTTOKENS = Object.freeze({
  CardAdapter: "CardAdapter",
  CardSetAdapter: "CardSetAdapter",
  CatalogAdapter: "CatalogAdapter",
  ColorAdapter: "ColorAdapter",
  LanguageAdapter: "LanguageAdapter",
  SymbologyAdapter: "SymbologyAdapter",
  SymbologyAlternativeAdapter: "SymbologyAlternativeAdapter",
  SymbologyColorMapAdapter: "SymbologyColorMapAdapter"
});

export default ADAPTTOKENS;
