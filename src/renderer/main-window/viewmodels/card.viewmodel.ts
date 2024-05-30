import { DtoCard, DtoCardLanguage, DtoCardface, DtoOracle } from "../../../common/dto";
import { CardLayout, CardRarity, MTGLanguage } from "../../../common/enums";
import { CardfaceViewmodel } from "./cardface.viewmodel";
import { OracleViewmodel } from "./oracle-viewmodel";

export class CardViewmodel {
  //#region private readonly fields -------------------------------------------
  private readonly _dtoCard: DtoCard;
  private readonly _collectorNumberSortValue: string;
  private readonly _cardManaCost: Array<string>;
  private readonly cardFaces: Map<number, CardfaceViewmodel>;
  private readonly oracles: Map<number, OracleViewmodel>;
  //#endregion

  //#region public getters for table ------------------------------------------
  public get cardManacost(): Array<string> {
    return this._cardManaCost;
  }

  public get cardName(): string {
    return this._dtoCard.layout != "reversible_card" ?
      this.joinMultiCardFaceData(this._dtoCard.oracle.map((oracle: DtoOracle) => oracle.oracle_name)) :
      this.joinMultiCardFaceData(this._dtoCard.cardfaces.map((cardface: DtoCardface) => cardface.oracle.oracle_name));
  }

  public get cardPower(): string {
    return this.joinMultiCardFaceData(this._dtoCard.cardfaces.map((cardface: DtoCardface) => cardface.power));
  }

  public get cardThoughness(): string {
    return this.joinMultiCardFaceData(this._dtoCard.cardfaces.map((cardface: DtoCardface) => cardface.toughness));
  }

  public get cardtypeLine(): string {
    return this.joinMultiCardFaceData(this._dtoCard.oracle.map((oracle: DtoOracle) => oracle.type_line));
  }

  public get collectorNumberSortValue(): string {
    return this._collectorNumberSortValue;
  }

  public get collectorNumber(): string {
    return this._dtoCard.collector_number;
  }

  public get rarity(): CardRarity {
    return this._dtoCard.rarity;
  }

  public get languages(): Array<MTGLanguage> {
    return this._dtoCard.languages.map((language: DtoCardLanguage) => language.lang);
  }
  //#endregion

  public get cardLayout(): CardLayout {
    return this._dtoCard.layout;
  }

  public get setId(): string {
    return this._dtoCard.set_id;
  }

  public get isMultipleLanguage(): boolean {
    return this._dtoCard.languages.length > 1;
  }

  public get oracleId(): string {
    return this._dtoCard.oracle_id;
  }

  public get cardId(): string {
    return this._dtoCard.id;
  }

  public get cardLanguage(): MTGLanguage {
    return this._dtoCard.lang;
  }

  public get otherCardLanguages(): Array<DtoCardLanguage> {
    return this._dtoCard.languages;
  }

  public get isLocalizedCard(): boolean {
    return this._dtoCard.lang != "en";
  }
  //#endregion

  //#region Constructor & C° --------------------------------------------------
  public constructor(cardDto: DtoCard) {
    this._dtoCard = cardDto;
    this._collectorNumberSortValue = isNaN(Number(cardDto.collector_number)) ? cardDto.collector_number : cardDto.collector_number.padStart(4, "0");
    this._cardManaCost = this.calculateCardManaCost(cardDto);
    this.cardFaces = new Map<number, CardfaceViewmodel>();
    this._dtoCard.cardfaces.sort((a: DtoCardface, b: DtoCardface) => a.sequence - b.sequence);
    this._dtoCard.cardfaces.forEach((cardface: DtoCardface) => this.cardFaces.set(cardface.sequence, new CardfaceViewmodel(cardface)));
    this.oracles = new Map<number, OracleViewmodel>();
    this._dtoCard.oracle.sort((a: DtoOracle, b: DtoOracle) => a.face_sequence - b.face_sequence);
    this._dtoCard.oracle.forEach((oracle: DtoOracle) => this.oracles.set(oracle.face_sequence, new OracleViewmodel(oracle)));
  }

  private calculateCardManaCost(cardDto: DtoCard): Array<string> {
    const result = new Array<string>();
    cardDto.cardfaces.forEach((cardface: DtoCardface, idx: number) => {
      if (idx > 0) {
        result.push("//");
      }
      result.push(...this.convertManaCost(cardface.mana_cost));
    });
    if (result.length == 1 && result[0] == "//") {
      result.pop();
    }
    else if (result[0] == "//") {
      result.splice(0, 0, "-");
    } else if (result[result.length - 1] == "//") {
      result.push("-");
    }
    return result;
  }

  private convertManaCost(manaCost: string): Array<string> {
    const splittedCellValue = manaCost.split("}");
    splittedCellValue.pop();
    return splittedCellValue.map((s: string, i: number) => i < splittedCellValue.length ? s + "}" : s);
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

  //#region Auxiliary methods -------------------------------------------------
  private joinMultiCardFaceData(data: Array<string | null>): string {
    if (data.filter((d: string) => d != null && d != undefined && d != "").length == 0) {
      return "";
    } else {
      return data
        .map((d: string) => d == null || d == undefined ? "-" : d)
        .join(" // ");
    }
  }
  //#endregion
}
