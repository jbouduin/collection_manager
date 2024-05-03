enum EQueryType {
  CardSet,
  Card,
  Catalog,
  Color,
  Symbology,
  Language
}

export type QueryType = keyof typeof EQueryType;
