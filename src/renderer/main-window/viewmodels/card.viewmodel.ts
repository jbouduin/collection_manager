import { DtoCard, DtoCardLanguage, DtoCardface, DtoOracle } from "../../../common/dto";
import { CardLayout, MTGLanguage } from "../../../common/enums";

export class CardViewmodel {
  //#region private readonly fields -------------------------------------------
  private readonly _dtoCard: DtoCard;
  private readonly _collectorNumberSortValue: string;
  private readonly _cardManaCost: Array<string>;
  //#endregion

  //#region public getters for table ------------------------------------------
  public get cardManacost(): Array<string> {
    return this._cardManaCost;
  }

  public get cardName(): string {
    return this.joinMultiCardFaceData(this._dtoCard.oracle.map((oracle: DtoOracle) => oracle.oracle_name));
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

  public get rarity(): string {
    return this._dtoCard.rarity;
  }
  //#endregion

  public get cardLayout(): CardLayout {
    return this._dtoCard.layout;
  }
  // non normal layout cards: this field is used for getting the image
  public get cardfaceId(): string {
    return this._dtoCard.cardfaces[0].card_id;
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

  public get language(): MTGLanguage {
    return this._dtoCard.lang;
  }
  public get oracleText(): string {
    return this._dtoCard.oracle[0].oracle_text;
  }

  public get flavorText(): string {
    return this._dtoCard.cardfaces[0].flavor_text;
  }

  public get hasFlavorText(): boolean {
    return this._dtoCard.cardfaces[0].flavor_text?.length > 0;
  }

  public get languages(): Array<MTGLanguage> {
    return this._dtoCard.languages.map((language: DtoCardLanguage) => language.lang);
  }

  public get cardLanuages(): Array<DtoCardLanguage> {
    return this._dtoCard.languages;
  }
  public get printedName(): string {
    return this._dtoCard.cardfaces[0].printed_name;
  }

  public get printedText(): string {
    return this._dtoCard.cardfaces[0].printed_text;
  }

  public get printedTypeLine(): string {
    return this._dtoCard.cardfaces[0].printed_type_line;
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
  }

  private calculateCardManaCost(cardDto: DtoCard): Array<string> {
    const result = new Array<string>();
    cardDto.cardfaces.forEach((cardface: DtoCardface, idx: number) => {
      if (idx > 0) {
        result.push("//");
      }
      result.push(...this.convertManaCost(cardface.mana_cost));
    });
    return result;
  }

  private convertManaCost(manaCost: string): Array<string> {
    const splittedCellValue = manaCost.split("}");
    splittedCellValue.pop();
    return splittedCellValue.map((s: string, i: number) => i < splittedCellValue.length ? s + "}" : s);
  }

  private joinMultiCardFaceData(data: Array<string | null>): string {
    if (data.filter((d: string) => d != null && d != undefined).length == 0) {
      return "";
    } else {
      return data
        .map((d: string) => d == null || d == undefined ? "-" : d)
        .join(" // ");
    }
  }
  //#endregion
}
