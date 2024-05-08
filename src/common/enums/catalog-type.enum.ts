enum ECatalogType {
  CardNames,
  ArtistNames,
  WordBank,
  CreatureTypes,
  PlaneswalkerTypes,
  LandTypes,
  ArtifactTypes,
  EnchantmentTypes,
  SpellTypes,
  Powers,
  Toughnesses ,
  Loyalties,
  Watermarks,
  KeywordAbilities,
  KeywordActions,
  AbilityWords,
  Supertypes
}

export type CatalogType = keyof typeof ECatalogType;
