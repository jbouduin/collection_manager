import { CardSetGroupBy, CardSetSort, CardSetType, CardSyncType, CatalogType, ImageStatus, RulingSyncType, TimespanUnit } from "../../../common/types";


export class DisplayValueService {
  //#region private fields ----------------------------------------------------
  private readonly _cardSetGroupByDisplayValues: Map<CardSetGroupBy, string>;
  private readonly _cardSetSortDisplayValues: Map<CardSetSort, string>;
  private readonly _cardSetTypeDisplayValues: Map<CardSetType, string>;
  private readonly _cardSyncTypeDisplayValues: Map<CardSyncType, string>;
  private readonly _catalogTypeDisplayValues: Map<CatalogType, string>;
  private readonly _imageStatusDisplayValues: Map<ImageStatus, string>;
  private readonly _rulingSyncTypeDisplayValues: Map<RulingSyncType, string>;
  private readonly _timespanUnitDisplayValues: Map<TimespanUnit, string>;
  //#endregion

  //#region public properties -------------------------------------------------
  public get cardSetGroupByDisplayValues(): Map<CardSetGroupBy, string> {
    return this._cardSetGroupByDisplayValues;
  }
  public get cardSetSortDisplayValues(): Map<CardSetSort, string> {
    return this._cardSetSortDisplayValues;
  }
  public get cardSetTypeDisplayValues(): Map<CardSetType, string> {
    return this._cardSetTypeDisplayValues;
  }
  public get cardSyncTypeDisplayValues(): Map<CardSyncType, string> {
    return this._cardSyncTypeDisplayValues;
  }
  public get catalogTypeDisplayValues(): Map<CatalogType, string> {
    return this._catalogTypeDisplayValues;
  }
  public get imageStatusDisplayValues(): Map<ImageStatus, string> {
    return this._imageStatusDisplayValues;
  }
  public get rulingSyncTypeDisplayValues(): Map<RulingSyncType, string> {
    return this._rulingSyncTypeDisplayValues;
  }
  public get timespanUnitDisplayValues(): Map<TimespanUnit, string> {
    return this._timespanUnitDisplayValues;
  }
  //#endregion

  //#region constructor & C° --------------------------------------------------
  public constructor() {
    this._cardSetGroupByDisplayValues = new Map<CardSetGroupBy, string>([
      ["none", "No grouping"],
      ["parent", "Parent"],
      ["block", "Block"],
      ["setType", "Set type"]
    ]);

    this._cardSetSortDisplayValues = new Map<CardSetSort, string>([
      ["releaseDateAscending", "Release date (ascending)"],
      ["releaseDateDescending", "Release date (descending)"],
      ["alphabeticallyAscending", "Alphabetically (ascending)"],
      ["alphabeticallyDescending", "Alphabetically (descending)"]
    ]);

    this._cardSetTypeDisplayValues = new Map<CardSetType, string>([
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

    this._cardSyncTypeDisplayValues = new Map<CardSyncType, string>([
      ["none", "Do not synchronize cards"],
      ["allCards", "All cards which have previously been synchronized"],
      // "byCardSet" => not to be shown in the front end
      ["byImageStatus", "Select by image status"],
      ["byLastSynchronized", "Last synchronized before"]
      // "selectionOfCards" => not to be shown in the front end
    ]);

    this._catalogTypeDisplayValues = new Map<CatalogType, string>([
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

    this._imageStatusDisplayValues = new Map<ImageStatus, string>([
      ["missing", "Missing"],
      ["placeholder", "Placeholder"],
      ["lowres", "Low resolution"]
      // "highres_scan" => not ot be shown in the front end
    ]);

    this._rulingSyncTypeDisplayValues = new Map<RulingSyncType, string>([
      ["none", "Do not synchronize rulings"],
      ["update", "Resynchronize previously synchronized rulings only"],
      ["all", "Synchronize rulings for all synchronized cards"]
      // "selectionOfCards" => not to be shown in front end
    ]);

    this._timespanUnitDisplayValues = new Map<TimespanUnit, string>([
      ["day", "Day(s)"],
      ["week", "Week(s)"],
      ["month", "Month(s)"],
      ["year", "Year(s)"]
    ]);
  }
}
