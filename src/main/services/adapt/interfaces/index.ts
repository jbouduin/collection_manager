// TODO most of these files just export a type, they could be put in here.
export * from "./card-card-map.adapter";
export * from "./card-color-map.adapter";
export * from "./card-format-legality.adapter";
export * from "./card-game.adapter";
export * from "./card-image.adapter";
export * from "./card-multiverse-id.adapter";
export * from "./card-set.adapter";
export * from "./card.adapter";
export * from "./catalog.adapter";
export * from "./ruling-line.adapter";
export * from "./ruling.adapter";
export * from "./symbology-alternative.adapter";
export * from "./symbology-color-map.adapter";
export * from "./symbology.adapter";

const ADAPTTOKENS = Object.freeze({
  CardCardMapAdapter: "CardCardMapAdapter",
  CardColorMapAdapter: "CardColorMapAdapter",
  CardFormatLegalityAdapter: "CardFormatLegalityAdapter",
  CardGameAdapter: "CardGameAdapter",
  CardImageAdapter: "CardImageAdapter",
  CardMultiverseIdAdapter: "CardMultiverseIdAdapter",
  CardSetAdapter: "CardSetAdapter",
  CardAdapter: "CardAdapter",
  CatalogAdapter: "CatalogAdapter",
  ColorAdapter: "ColorAdapter",
  LanguageAdapter: "LanguageAdapter",
  RulingLineAdapter: "RulingLineAdapter",
  RulingAdapter: "RulingAdapter",
  SymbologyAdapter: "SymbologyAdapter",
  SymbologyAlternativeAdapter: "SymbologyAlternativeAdapter",
  SymbologyColorMapAdapter: "SymbologyColorMapAdapter"
});

export default ADAPTTOKENS;
