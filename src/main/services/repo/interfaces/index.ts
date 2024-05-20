export * from "./card-set.repository";
export * from "./card.repository";
export * from "./color-repository";
export * from "./catalog.repository";
export * from "./language.repository";
export * from "./ruling.respository";
export * from "./card-symbol.repository";

const REPOTOKENS = Object.freeze({
  CardRepository: "CardRepository",
  CardSetRepository: "CardSetRepository",
  CatalogRepository: "CatalogRepository",
  ColorRepository: "ColorRepository",
  LanguageRepository: "LanguageRepository",
  RulingRepository: "RulingRepository",
  CardSymbolRepository: "CardSymbolRepository"
});

export default REPOTOKENS;
