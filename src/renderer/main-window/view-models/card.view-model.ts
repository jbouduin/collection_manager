import { DtoCard, DtoCardface } from "../../../common/dto";
import { MTGLanguage } from "../../../common/enums";

export class CardViewmodel {
  private readonly _cardDto: DtoCard;
  private readonly _collectorNumberSortValue: string;
  private readonly _cardManaCost: Array<string>;

  // FEATURE cards with multiple faces:
  // non normal layout cards: this field is used for getting the image
  public get cardfaceId(): string {
    return this._cardDto.cardfaces[0].id;
  }

  public get setId(): string {
    return this._cardDto.set_id;
  }

  public get isMultipleLanguage(): boolean {
    return this._cardDto.languages.length > 1;
  }

  public get cardManacost(): Array<string> {
    return this._cardManaCost;
  }

  public get cardName(): string {
    return this._cardDto.oracle?.oracle_name ?? this._cardDto.name;
  }

  public get cardPower(): string {
    return this._cardDto.cardfaces
      .map((cardface: DtoCardface) => cardface.power)
      .join(" // ");
  }

  public get cardThoughness(): string {
    return this._cardDto.cardfaces
      .map((cardface: DtoCardface) => cardface.toughness)
      .join(" // ");
  }

  public get cardtypeLine(): string {
    return this._cardDto.oracle.type_line;
  }

  public get collectorNumberSortValue(): string {
    return this._collectorNumberSortValue;
  }

  public get collectorNumber(): string {
    return this._cardDto.collector_number;
  }

  public get rarity(): string {
    return this._cardDto.rarity;
  }

  public get oracleId(): string {
    return this._cardDto.oracle_id;
  }

  public get cardId(): string {
    return this._cardDto.id;
  }

  public get oracleText(): string {
    return this._cardDto.oracle.oracle_text;
  }

  public get flavorText(): string {
    return this._cardDto.cardfaces[0].flavor_text;
  }

  public get hasFlavorText(): boolean {
    return this._cardDto.cardfaces[0].flavor_text?.length > 0;
  }

  public get languages(): Array<MTGLanguage> {
    return this._cardDto.languages.map((language: { lang: MTGLanguage }) => language.lang);
  }

  public get printedName(): string {
    return this._cardDto.cardfaces[0].printed_name;
  }

  public get printedText(): string {
    return this._cardDto.cardfaces[0].printed_text;
  }

  public get printedTypeLine(): string {
    return this._cardDto.cardfaces[0].printed_type_line;
  }

  public constructor(cardDto: DtoCard) {
    this._cardDto = cardDto;
    this._collectorNumberSortValue = isNaN(Number(cardDto.collector_number)) ? cardDto.collector_number : cardDto.collector_number.padStart(4, "0");
    this._cardManaCost = this.calculateCardManaCost(cardDto);
  }

  //#region private methods ---------------------------------------------------
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
