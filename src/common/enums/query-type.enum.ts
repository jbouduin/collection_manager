enum EQueryType {
  CardSet,
  Card,
  Catalog
}

export type QueryType = keyof typeof EQueryType;
