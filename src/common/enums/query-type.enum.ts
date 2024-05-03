enum EQueryType {
  CardSet,
  Card,
  Catalog,
  Language
}

export type QueryType = keyof typeof EQueryType;
