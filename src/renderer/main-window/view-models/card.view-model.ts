import { DtoCard, DtoCardface } from "../../../common/dto";

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

  public constructor(cardDto: DtoCard) {
    this.cardDto = cardDto;
  }

  // private getLocalizedCardfaces(lang: MTGLanguage): Array<CardfaceDto> {
  //   return this.cardDto.cardfaces
  //     .filter((cardface: CardfaceDto) =>
  //       cardface.localizations.filter((localization: CardfaceLocalizationDto) => localization.lang == lang).length > 0
  //     );
  // }
}
