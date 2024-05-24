import { DtoCard, DtoCardface } from "../../../common/dto";
import { MTGLanguage } from "../../../common/enums";

export class CardViewmodel {
  private readonly cardDto: DtoCard;

  // FEATURE cards with multiple faces:
  // non normal layout cards: this field is used for getting the image
  public get cardfaceId(): string {
    return this.cardDto.cardfaces[0].id;
  }

  public get setId(): string {
    return this.cardDto.set_id;
  }

  public get isMultipleLanguage(): boolean {
    return this.cardDto.languages.length > 1;
  }

  public get cardManacost(): Array<string> {
    const result = new Array<string>();
    this.cardDto.cardfaces.forEach((cardface: DtoCardface, idx: number) => {
      if (idx > 0) {
        result.push("//");
      }
      result.push(...cardface.manaCostArray);
    });
    return result;
  }

  public get cardName(): string {
    return this.cardDto.oracle?.oracle_name ?? this.cardDto.name;
  }

  public get cardPower(): string {
    return this.cardDto.cardfaces
      .map((cardface: DtoCardface) => cardface.power)
      .join(" // ");
  }

  public get cardThoughness(): string {
    return this.cardDto.cardfaces
      .map((cardface: DtoCardface) => cardface.toughness)
      .join(" // ");
  }

  public get cardtypeLine(): string {
    return this.cardDto.oracle.type_line;
  }

  public get collectorNumberSortValue(): string {
    return this.cardDto.collectorNumberSortValue;
  }

  public get collectorNumber(): string {
    return this.cardDto.collector_number;
  }

  public get rarity(): string {
    return this.cardDto.rarity;
  }

  public get oracleId(): string {
    return this.cardDto.oracle_id;
  }

  public get cardId(): string {
    return this.cardDto.id;
  }

  public get oracleText(): string {
    return this.cardDto.oracle.oracle_text;
  }

  public get flavorText(): string {
    return this.cardDto.cardfaces[0].flavor_text;
  }

  public get hasFlavorText(): boolean {
    return this.cardDto.cardfaces[0].flavor_text?.length > 0;
  }

  public get languages(): Array<MTGLanguage> {
    return this.cardDto.languages.map((language: { lang: MTGLanguage }) => language.lang);
  }

  public get printedName(): string {
    return this.cardDto.cardfaces[0].printed_name;
  }

  public get printedText(): string {
    return this.cardDto.cardfaces[0].printed_text;
  }

  public get printedTypeLine(): string {
    return this.cardDto.cardfaces[0].printed_type_line;
  }

  public constructor(cardDto: DtoCard) {
    this.cardDto = cardDto;
  }
}
