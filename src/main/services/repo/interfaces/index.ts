export * from "./card-set.repository";
export * from "./card-symbol.repository";
export * from "./card.repository";
export * from "./catalog.repository";
export * from "./color-repository";
export * from "./language.repository";
export * from "./oracle.respository";

const REPOTOKENS = Object.freeze({
  CardRepository: "CardRepository",
  CardSetRepository: "CardSetRepository",
  CardSymbolRepository: "CardSymbolRepository",
  CatalogRepository: "CatalogRepository",
  CollectionRepository: "CollectionRepository",
  ColorRepository: "ColorRepository",
  LanguageRepository: "LanguageRepository",
  OracleRepository: "OracleRepository"
});

export default REPOTOKENS;
