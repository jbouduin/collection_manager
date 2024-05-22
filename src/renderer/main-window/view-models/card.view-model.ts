import { MTGLanguage } from "../../../common/enums";
import { CardDto, CardfaceDto, CardfaceLocalizationDto } from "../../../common/dto";

export class CardViewmodel {
  private readonly cardDto: CardDto;

  // FEATURE cards with multiple faces:
  // non normal layout cards: this field is used for getting the image
  public get localizationId(): string {
    return this.getLocalizedCardfaces("en")[0].localizations[0].id;
  }

  public get setId(): string {
    return this.cardDto.card.set_id;
  }

  public get cardManacost(): Array<string> {
    const result = new Array<string>();
    this.getLocalizedCardfaces("en").forEach((cardface: CardfaceDto, idx: number) => {
      if (idx > 0) {
        result.push("//");
      }
      result.push(...cardface.manaCostArray);
    });
    return result;
  }

  public get cardName(): string {
    return this.cardDto.oracle.oracle_name;
  }

  public get cardPower(): string {
    return this.getLocalizedCardfaces("en")
      .map((cardface: CardfaceDto) => cardface.cardface.power)
      .join(" // ");
  }

  public get cardThoughness(): string {
    return this.getLocalizedCardfaces("en")
      .map((cardface: CardfaceDto) => cardface.cardface.toughness)
      .join(" // ");
  }

  public get cardtypeLine(): string {
    return this.cardDto.oracle.type_line;
  }

  public get collectorNumberSortValue(): string {
    return this.cardDto.collectorNumberSortValue;
  }

  public get collectorNumber(): string {
    return this.cardDto.card.collector_number;
  }

  public get rarity(): string {
    return this.cardDto.card.rarity;
  }

  public get oracleId(): string {
    return this.cardDto.card.oracle_id;
  }

  public get cardId(): string {
    return this.cardDto.card.id;
  }

  public get oracleText(): string {
    return this.cardDto.oracle.oracle_text;
  }

  public get flavorText(): string {
    return this.getLocalizedCardfaces("en")[0].localizations[0].flavor_text;
  }
  public constructor(cardDto: CardDto) {
    this.cardDto = cardDto;
  }

  private getLocalizedCardfaces(lang: MTGLanguage): Array<CardfaceDto> {
    return this.cardDto.cardfaces
      .filter((cardface: CardfaceDto) =>
        cardface.localizations.filter((localization: CardfaceLocalizationDto) => localization.lang == lang).length > 0
      );
  }
}
