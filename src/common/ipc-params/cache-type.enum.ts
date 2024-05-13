enum ECacheType {
  "CardSymbol",
  "CardFace"
}


// NOW use in query for cached svg
export type CacheType = keyof typeof ECacheType;
