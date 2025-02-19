import { OwnedCardListDto, MtgCardColorDto, MtgCardDetailDto, MtgCardLanguageDto, MtgCardListDto, MtgCardfaceDto, OracleDto, OwnedCardDto } from "../../../../common/dto";
import { CardLayout, CardRarity, MTGLanguage } from "../../../../common/types";
import { OracleViewmodel } from "../oracle/oracle-viewmodel";
import { CardfaceViewmodel } from "./cardface.viewmodel";

/* eslint-disable  @typescript-eslint/no-duplicate-type-constituents */
abstract class BaseCardViewmodel<T extends MtgCardListDto | MtgCardDetailDto | OwnedCardListDto> {
  //#region private readonly fields -------------------------------------------
  private readonly _cardManaCost: Array<string>;
  //#endregion

  //#region protected fields --------------------------------------------------
  protected readonly _dtoCard: T;
  //#endregion

  //#region common getters ----------------------------------------------------
  public get cardId(): string {
    return this._dtoCard.id;
  }

  public get cardManacost(): Array<string> {
    return this._cardManaCost;
  }

  public get cardName(): string {
    return this._dtoCard.layout != "reversible_card"
      ? this.joinMultiCardFaceData(this._dtoCard.oracle.map((oracle: OracleDto) => oracle.oracle_name))
      : this.joinMultiCardFaceData(this._dtoCard.cardfaces.map((cardface: MtgCardfaceDto) => cardface.oracle.oracle_name));
  }

  public get cardTypeLine(): string {
    return this.joinMultiCardFaceData(this._dtoCard.oracle.map((oracle: OracleDto) => oracle.type_line));
  }

  public get rarity(): CardRarity {
    return this._dtoCard.rarity;
  }

  public get setId(): string {
    return this._dtoCard.set_id;
  }
  //#endregion

  //#region Constructor & C° --------------------------------------------------
  public constructor(dtoCard: T) {
    this._dtoCard = dtoCard;
    this._cardManaCost = this.calculateCardManaCost(dtoCard);
  }

  private calculateCardManaCost(dtoCard: T): Array<string> {
    const result = new Array<string>();
    dtoCard.cardfaces.forEach((cardface: MtgCardfaceDto, idx: number) => {
      if (idx > 0) {
        result.push("//");
      }
      result.push(...this.convertManaCost(cardface.mana_cost));
    });
    if (result.length == 1 && result[0] == "//") {
      result.pop();
    } else if (result[0] == "//") {
      result.splice(0, 0, "-");
    } else if (result[result.length - 1] == "//") {
      result.push("-");
    }
    return result;
  }

  private convertManaCost(manaCost: string): Array<string> {
    const splittedCellValue = manaCost.split("}");
    splittedCellValue.pop();
    return splittedCellValue.map((s: string, i: number) => {
      /* es-lint-disable-next-line @stylistic/operator-linebreak */
      return i < splittedCellValue.length ? s + "}" : s;
    });
  }
  //#endregion

  //#region Auxiliary methods -------------------------------------------------
  protected joinMultiCardFaceData(data: Array<string | null>): string {
    if (data.filter((d: string) => d != null && d != undefined && d != "").length == 0) {
      return "";
    } else {
      return data
        .map((d: string) => {
          /* es-lint-disable-next-line @stylistic/operator-linebreak */
          return d == null || d == undefined ? "-" : d;
        })
        .join(" // ");
    }
  }
  //#endregion
}
abstract class MtgCardViewmodel<T extends MtgCardListDto | MtgCardDetailDto> extends BaseCardViewmodel<T> {
  //#region common getters ----------------------------------------------------
  public get otherCardLanguages(): Array<MtgCardLanguageDto> {
    return this._dtoCard.languages;
  }
  //#endregion

  //#region Constructor & C° --------------------------------------------------
  public constructor(dtoCard: T) {
    super(dtoCard);
  }
  //#endregion
}

export class MtgCardListViewmodel extends MtgCardViewmodel<MtgCardListDto> {
  //#region private readonly fields -------------------------------------------
  private readonly _collectorNumberSortValue: string;
  //#endregion

  //#region List Specific getters ---------------------------------------------
  public get cardPower(): string {
    return this.joinMultiCardFaceData(this._dtoCard.cardfaces.map((cardface: MtgCardfaceDto) => cardface.power));
  }

  public get cardThoughness(): string {
    return this.joinMultiCardFaceData(this._dtoCard.cardfaces.map((cardface: MtgCardfaceDto) => cardface.toughness));
  }

  public get collectorNumberSortValue(): string {
    return this._collectorNumberSortValue;
  }

  public get collectorNumber(): string {
    return this._dtoCard.collector_number;
  }

  public get languages(): Array<MTGLanguage> {
    return this._dtoCard.languages.map((language: MtgCardLanguageDto) => language.lang);
  }

  public get colorIdentity(): Array<string> {
    return this._dtoCard.cardColors
      .filter((cardColor: MtgCardColorDto) => cardColor.color_type == "identity")
      .map((cardColor: MtgCardColorDto) => cardColor.mana_symbol);
  }
  //#endregion

  //#region Constructor & C° --------------------------------------------------
  public constructor(dtoCard: MtgCardListDto) {
    super(dtoCard);
    this._collectorNumberSortValue = isNaN(Number(dtoCard.collector_number)) ? dtoCard.collector_number : dtoCard.collector_number.padStart(4, "0");
  }
  //#endregion
}

export class MtgCardDetailViewmodel extends MtgCardViewmodel<MtgCardDetailDto> {
  private readonly cardFaces: Map<number, CardfaceViewmodel>;
  private readonly oracles: Map<number, OracleViewmodel>;

  //#region Detail specific getters -------------------------------------------
  public get cardLanguage(): MTGLanguage {
    return this._dtoCard.lang;
  }

  public get cardLayout(): CardLayout {
    return this._dtoCard.layout;
  }

  public get isMultipleLanguage(): boolean {
    return this._dtoCard.languages.length > 1;
  }

  public get oracleId(): string {
    return this._dtoCard.oracle_id;
  }
  //#endregion

  //#region Constructor & C° --------------------------------------------------
  public constructor(dtoCard: MtgCardListDto) {
    super(dtoCard);
    this.cardFaces = new Map<number, CardfaceViewmodel>();
    this._dtoCard.cardfaces.sort((a: MtgCardfaceDto, b: MtgCardfaceDto) => a.sequence - b.sequence);
    this._dtoCard.cardfaces.forEach((cardface: MtgCardfaceDto) => this.cardFaces.set(cardface.sequence, new CardfaceViewmodel(cardface)));
    this.oracles = new Map<number, OracleViewmodel>();
    this._dtoCard.oracle.sort((a: OracleDto, b: OracleDto) => a.face_sequence - b.face_sequence);
    this._dtoCard.oracle.forEach((oracle: OracleDto) => this.oracles.set(oracle.face_sequence, new OracleViewmodel(oracle)));
  }
  //#endregion

  //#region Public methods ----------------------------------------------------
  public getCardface(sequence: number): CardfaceViewmodel {
    return this.cardFaces.get(sequence);
  }

  public getOracle(sequence: number): OracleViewmodel {
    return this.oracles.get(sequence);
  }
  //#endregion
}

export class CollectionCardListViewmodel extends BaseCardViewmodel<OwnedCardListDto> {
  //#region Getters -----------------------------------------------------------
  public get cardPower(): string {
    return this.joinMultiCardFaceData(this._dtoCard.cardfaces.map((cardface: MtgCardfaceDto) => cardface.power));
  }

  public get cardThoughness(): string {
    return this.joinMultiCardFaceData(this._dtoCard.cardfaces.map((cardface: MtgCardfaceDto) => cardface.toughness));
  }

  public get collectorNumber(): string {
    return this._dtoCard.collector_number;
  }

  public get colorIdentity(): Array<string> {
    return this._dtoCard.cardColors
      .filter((cardColor: MtgCardColorDto) => cardColor.color_type == "identity")
      .map((cardColor: MtgCardColorDto) => cardColor.mana_symbol);
  }

  public get language(): MTGLanguage {
    return this._dtoCard.lang;
  }

  public get dateSortValue(): string {
    return this._dtoCard.released_at.toISOString();
  }
  public get setId(): string {
    return this._dtoCard.set_id;
  }

  public get ownedCards(): Array<OwnedCardDto> {
    return this._dtoCard.ownedCards;
  }
  //#endregion

  //#region Constructor & C° --------------------------------------------------
  public constructor(dtoCard: OwnedCardListDto) {
    super(dtoCard);
  }
  //#endregion
}
