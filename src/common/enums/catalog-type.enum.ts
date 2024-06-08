enum ECatalogType {
  AbilityWords,
  ArtifactTypes,
  ArtistNames,
  CardNames,
  CreatureTypes,
  EnchantmentTypes,
  KeywordActions,
  KeywordAbilities,
  LandTypes,
  Loyalties,
  PlaneswalkerTypes,
  Powers,
  SpellTypes,
  Supertypes,
  Toughnesses,
  Watermarks,
  WordBank
}

export type CatalogType = keyof typeof ECatalogType;

export const AllCatalogTypes: Array<CatalogType> = Object.keys(ECatalogType)
  .filter(prop => isNaN(parseInt(prop))) as Array<CatalogType>;

export const CatalogTypeDisplayValue = new Map<CatalogType, string>([
  ["AbilityWords", "Abilities"],
  ["ArtifactTypes", "Artifact types"],
  ["ArtistNames", "Artist names"],
  ["CardNames", " all nontoken English card names"],
  ["CreatureTypes", "Creature types"],
  ["EnchantmentTypes", "Enchantment types"],
  ["KeywordActions", "Action keywords"],
  ["KeywordAbilities", "Ability keywords"],
  ["LandTypes", "Land types"],
  ["Loyalties", "Loyalites"],
  ["PlaneswalkerTypes", "Planeswalker types"],
  ["Powers", "All possible powers"],
  ["SpellTypes", "Spell types"],
  ["Supertypes", "Super types"],
  ["Toughnesses", "All possible thoughnesses"],
  ["Watermarks", "Watermarks"],
  ["WordBank", "Words that could appear in a card name"]
]);
