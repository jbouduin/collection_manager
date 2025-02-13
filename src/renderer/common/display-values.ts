import { CardSetGroupBy, CardSetSort, CardSetType, CardSyncType, CatalogType, ImageStatus, RulingSyncType, TimespanUnit } from "../../common/types";
// TODO use records instead of maps

export const CardSetGroupByDisplayValue = new Map<CardSetGroupBy, string>([
  ["none", "No grouping"],
  ["parent", "Parent"],
  ["block", "Block"],
  ["setType", "Set type"]
]);

export const CardSetSortDisplayValue = new Map<CardSetSort, string>([
  ["releaseDateAscending", "Release date (ascending)"],
  ["releaseDateDescending", "Release date (descending)"],
  ["alphabeticallyAscending", "Alphabetically (ascending)"],
  ["alphabeticallyDescending", "Alphabetically (descending)"]
]);

export const CardSetTypeDisplayValue = new Map<CardSetType, string>([
  ["alchemy", "Alchemy"],
  ["archenemy", "Archenemy"],
  ["arsenal", "Arsenal"],
  ["box", "Box"],
  ["commander", "Commander"],
  ["core", "Core Set"],
  ["draft_innovation", "Draft innovation"],
  ["duel_deck", "Duel deck"],
  ["expansion", "Expansion"],
  ["from_the_vault", "From the vault"],
  ["funny", "Funny"],
  ["masterpiece", "Masterpiece"],
  ["masters", "Masters"],
  ["memorabilia", "Memorabilia"],
  ["minigame", "Minigame"],
  ["planechase", "Planechase"],
  ["premium_deck", "Premium deck"],
  ["promo", "Promo"],
  ["spellbook", "Spellbook"],
  ["starter", "Starter"],
  ["token", "Token"],
  ["treasure_chest", "Treasure chest"],
  ["vanguard", "Vanguard"]
]);

export const CardSyncTypeDisplayValue = new Map<CardSyncType, string>([
  ["none", "Do not synchronize cards"],
  ["allCards", "All cards which have previously been synchronized"],
  // "byCardSet" => not to be shown in the front end
  ["byImageStatus", "Select by image status"],
  ["byLastSynchronized", "Last synchronized before"]
  // "selectionOfCards" => not to be shown in the front end
]);

export const CatalogTypeDisplayValue = new Map<CatalogType, string>([
  ["AbilityWords", "Abilities"],
  ["ArtifactTypes", "Artifact types"],
  ["ArtistNames", "Artist names"],
  ["CardNames", "Nontoken English card names"],
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

export const ImageStatusDisplayValue = new Map<ImageStatus, string>([
  ["missing", "Missing"],
  ["placeholder", "Placeholder"],
  ["lowres", "Low resolution"]
  // "highres_scan" => not ot be shown in the front end
]);

export const RulingSyncTypeDisplayValue = new Map<RulingSyncType, string>([
  ["none", "Do not synchronize rulings"],
  ["update", "Resynchronize previously synchronized rulings only"],
  ["all", "Synchronize rulings for all synchronized cards"]
  // "selectionOfCards" => not to be shown in front end
]);

export const TimespanUnitDisplayValue = new Map<TimespanUnit, string>([
  ["day", "Day(s)"],
  ["week", "Week(s)"],
  ["month", "Month(s)"],
  ["year", "Year(s)"]
]);
