enum ECacheType {
  "CardSymbol",
  "CardFace",
  "CardSet"
}


// LATER use in query for cached svg or remove this enum definition
export type CacheType = keyof typeof ECacheType;
