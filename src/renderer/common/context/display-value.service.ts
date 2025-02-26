import { CardLegality, CardSetGroupBy, CardSetSort, CardSetType, CardSyncType, CatalogType, GameFormat, ImageStatus, RulingSyncType, TimespanUnit } from "../../../common/types";


export class DisplayValueService {
  //#region private fields ----------------------------------------------------
  private readonly _cardLegalityDisplayValues: Record<CardLegality, string>;
  private readonly _cardSetGroupByDisplayValues: Record<CardSetGroupBy, string>;
  private readonly _cardSetSortDisplayValues: Record<CardSetSort, string>;
  private readonly _cardSetTypeDisplayValues: Record<CardSetType, string>;
  private readonly _cardSyncTypeDisplayValues: Record<CardSyncType, string>;
  private readonly _catalogTypeDisplayValues: Record<CatalogType, string>;
  private readonly _imageStatusDisplayValues: Record<ImageStatus, string>;
  private readonly _gameFormatDisplayValues: Record<GameFormat, string>;
  private readonly _rulingSyncTypeDisplayValues: Record<RulingSyncType, string>;
  private readonly _timespanUnitDisplayValues: Record<TimespanUnit, string>;
  //#endregion

  //#region public properties -------------------------------------------------
  public get cardLegalityDisplayValues(): Record<CardLegality, string> {
    return this._cardLegalityDisplayValues;
  }

  public get cardSetGroupByDisplayValues(): Record<CardSetGroupBy, string> {
    return this._cardSetGroupByDisplayValues;
  }

  public get cardSetSortDisplayValues(): Record<CardSetSort, string> {
    return this._cardSetSortDisplayValues;
  }

  public get cardSetTypeDisplayValues(): Record<CardSetType, string> {
    return this._cardSetTypeDisplayValues;
  }

  public get cardSyncTypeDisplayValues(): Record<CardSyncType, string> {
    return this._cardSyncTypeDisplayValues;
  }

  public get catalogTypeDisplayValues(): Record<CatalogType, string> {
    return this._catalogTypeDisplayValues;
  }

  public get imageStatusDisplayValues(): Record<ImageStatus, string> {
    return this._imageStatusDisplayValues;
  }

  public get gameFormatDisplayValues(): Record<GameFormat, string> {
    return this._gameFormatDisplayValues;
  }

  public get rulingSyncTypeDisplayValues(): Record<RulingSyncType, string> {
    return this._rulingSyncTypeDisplayValues;
  }

  public get timespanUnitDisplayValues(): Record<TimespanUnit, string> {
    return this._timespanUnitDisplayValues;
  }
  //#endregion

  //#region constructor & C° --------------------------------------------------
  public constructor() {
    this._cardLegalityDisplayValues = {
      banned: "Banned",
      legal: "Legal",
      not_legal: "Not legal",
      restricted: "Restricted"
    };

    this._cardSetGroupByDisplayValues = {
      none: "No grouping",
      parent: "Parent",
      block: "Block",
      setType: "Set type"
    };

    this._cardSetSortDisplayValues = {
      releaseDateAscending: "Release date (ascending)",
      releaseDateDescending: "Release date (descending)",
      alphabeticallyAscending: "Alphabetically (ascending)",
      alphabeticallyDescending: "Alphabetically (descending)"
    };

    this._cardSetTypeDisplayValues = {
      alchemy: "Alchemy",
      archenemy: "Archenemy",
      arsenal: "Arsenal",
      box: "Box",
      commander: "Commander",
      core: "Core Set",
      draft_innovation: "Draft innovation",
      duel_deck: "Duel deck",
      expansion: "Expansion",
      from_the_vault: "From the vault",
      funny: "Funny",
      masterpiece: "Masterpiece",
      masters: "Masters",
      memorabilia: "Memorabilia",
      minigame: "Minigame",
      planechase: "Planechase",
      premium_deck: "Premium deck",
      promo: "Promo",
      spellbook: "Spellbook",
      starter: "Starter",
      token: "Token",
      treasure_chest: "Treasure chest",
      vanguard: "Vanguard"
    };

    this._cardSyncTypeDisplayValues = {
      none: "Do not synchronize cards",
      allCards: "All cards which have previously been synchronized",
      byCardSet: undefined, // => not to be shown in the front end
      byImageStatus: "Select by image status",
      byLastSynchronized: "Last synchronized before",
      collection: undefined // => not to be shown in the front end
    };

    this._catalogTypeDisplayValues = {
      AbilityWords: "Abilities",
      ArtifactTypes: "Artifact types",
      ArtistNames: "Artist names",
      CardNames: "Nontoken English card names",
      CreatureTypes: "Creature types",
      EnchantmentTypes: "Enchantment types",
      KeywordActions: "Action keywords",
      KeywordAbilities: "Ability keywords",
      LandTypes: "Land types",
      Loyalties: "Loyalites",
      PlaneswalkerTypes: "Planeswalker types",
      Powers: "All possible powers",
      SpellTypes: "Spell types",
      Supertypes: "Super types",
      Toughnesses: "All possible thoughnesses",
      Watermarks: "Watermarks",
      WordBank: "Words that could appear in a card name"
    };

    this._imageStatusDisplayValues = {
      missing: "Missing",
      placeholder: "Placeholder",
      lowres: "Low resolution",
      highres_scan: undefined // => not ot be shown in the front end
    };

    this._rulingSyncTypeDisplayValues = {
      none: "Do not synchronize rulings",
      update: "Resynchronize previously synchronized rulings only",
      all: "Synchronize rulings for all synchronized cards",
      selectionOfCards: undefined, // => not to be shown in front end
      oracleId: undefined // => not to be shown in front end
    };

    this._timespanUnitDisplayValues = {
      day: "Day(s)",
      week: "Week(s)",
      month: "Month(s)",
      year: "Year(s)"
    };

    this._gameFormatDisplayValues = {
      alchemy: "Alchemy",
      brawl: "Brawl",
      commander: "Commander",
      duel: "Duel",
      explorer: "Explorer",
      future: "Future",
      gladiator: "Gladiator",
      historic: "Historic",
      legacy: "Legacy",
      modern: "Modern",
      oathbreaker: "Oathbreaker",
      oldschool: "Oldschool",
      pauper: "Pauper",
      paupercommander: "Pauper Commander",
      penny: "Penny",
      pioneer: "Pioneer",
      predh: "Predh ???",
      premodern: "Pre-modern",
      standard: "Standard",
      standardbrawl: "Standard Brawl",
      timeless: "Timeless",
      vintage: "Vintage"
    };
  }
}
