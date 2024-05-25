import { DtoCard, DtoCardLanguage, DtoCardface } from "../../../common/dto";
import { MTGLanguage } from "../../../common/enums";

export class CardViewmodel {
  //#region private readonly fields -------------------------------------------
  private readonly _dtoCard: DtoCard;
  private readonly _collectorNumberSortValue: string;
  private readonly _cardManaCost: Array<string>;
  //#endregion

  //#region public getters ----------------------------------------------------
  // non normal layout cards: this field is used for getting the image
  public get cardfaceId(): string {
    return this._dtoCard.cardfaces[0].id;
  }

  public get setId(): string {
    return this._dtoCard.set_id;
  }

  public get isMultipleLanguage(): boolean {
    return this._dtoCard.languages.length > 1;
  }

  public get cardManacost(): Array<string> {
    return this._cardManaCost;
  }

  public get cardName(): string {
    return this._dtoCard.oracle?.oracle_name ?? this._dtoCard.name;
  }

  public get cardPower(): string {
    return this._dtoCard.cardfaces
      .map((cardface: DtoCardface) => cardface.power)
      .join(" // ");
  }

  public get cardThoughness(): string {
    return this._dtoCard.cardfaces
      .map((cardface: DtoCardface) => cardface.toughness)
      .join(" // ");
  }

  public get cardtypeLine(): string {
    return this._dtoCard.oracle.type_line;
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
    return this._dtoCard.oracle.oracle_text;
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
  //#endregion
}
