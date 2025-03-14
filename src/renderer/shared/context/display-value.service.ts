import { CardLegality, CardRarity, CardSetGroupBy, CardSetSort, CardSetType, ImageStatus, RulingSyncType, TimespanUnit } from "../../../common/types";

/**
 * The display service is using maps to make sure we add new display values if new key's are added
 */
export class DisplayValueService {
  //#region private fields ----------------------------------------------------
  private readonly _cardLegalityDisplayValues: Record<CardLegality, string>;
  private readonly _cardRarityDisplayValues: Record<CardRarity, string>;
  private readonly _cardSetGroupByDisplayValues: Record<CardSetGroupBy, string>;
  private readonly _cardSetSortDisplayValues: Record<CardSetSort, string>;
  private readonly _cardSetTypeDisplayValues: Record<CardSetType, string>;
  private readonly _imageStatusDisplayValues: Record<ImageStatus, string>;
  private readonly _rulingSyncTypeDisplayValues: Record<RulingSyncType, string>;
  private readonly _timespanUnitDisplayValues: Record<TimespanUnit, string>;
  //#endregion

  //#region public properties -------------------------------------------------
  public get cardLegalityDisplayValues(): Record<CardLegality, string> {
    return this._cardLegalityDisplayValues;
  }

  public get cardRarityDisplayValues(): Record<CardRarity, string> {
    return this._cardRarityDisplayValues;
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

  public get imageStatusDisplayValues(): Record<ImageStatus, string> {
    return this._imageStatusDisplayValues;
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
      legal: "Legal",
      banned: "Banned",
      not_legal: "Not legal",
      restricted: "Restricted"
    };

    this._cardRarityDisplayValues = {
      mythic: "Mythic",
      rare: "Rare",
      uncommon: "Uncommon",
      common: "Common",
      bonus: "Bonus",
      special: "Special"
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
  }
  //#endregion
}
