import { IDeckCardListDto, IMtgCardColorDto, IMtgCardfaceDto, IMtgCardListDto, IOwnedCardListDto } from "../../../../common/dto";
import { MtgLanguage } from "../../../../common/types";
import { BaseMtgCardViewmodel } from "./base-mtg-card.viewmodel";

export abstract class BaseMtgCardListViewmodel<T extends IOwnedCardListDto | IDeckCardListDto | IMtgCardListDto> extends BaseMtgCardViewmodel<T> {
  private readonly _collectorNumberSortValue: string;
  private readonly _colorIdentity: Array<string>;
  private readonly _coloridentitySortValue: string;

  //#region Getters -----------------------------------------------------------
  public get cardPower(): string {
    return this.joinMultiCardFaceData(this._dtoCard.cardfaces.map((cardface: IMtgCardfaceDto) => cardface.power));
  }

  public get cardThoughness(): string {
    return this.joinMultiCardFaceData(this._dtoCard.cardfaces.map((cardface: IMtgCardfaceDto) => cardface.toughness));
  }

  public get collectorNumber(): string {
    return this._dtoCard.collector_number;
  }

  public get collectorNumberSortValue(): string {
    return this._collectorNumberSortValue;
  }

  public get colorIdentity(): Array<string> {
    return this._colorIdentity;
  }

  public get colorIdentitySortValue(): string {
    return this._coloridentitySortValue;
  }
  public get language(): MtgLanguage {
    return this._dtoCard.lang;
  }

  public get dateSortValue(): string {
    return this._dtoCard.released_at.toISOString();
  }
  public get setId(): string {
    return this._dtoCard.set_id;
  }
  //#endregion

  //#region Constructor & C° --------------------------------------------------
  public constructor(dtoCard: T) {
    super(dtoCard);
    this._collectorNumberSortValue = isNaN(Number(dtoCard.collector_number)) ? dtoCard.collector_number : dtoCard.collector_number.padStart(4, "0");
    this._colorIdentity = dtoCard.cardColors
      .filter((cardColor: IMtgCardColorDto) => cardColor.color_type == "identity")
      .sort((a: IMtgCardColorDto, b: IMtgCardColorDto) => a.sequence - b.sequence)
      .map((cardColor: IMtgCardColorDto) => cardColor.mana_symbol);
    this._coloridentitySortValue = "";
    const cardColors = this._dtoCard.cardColors
      .filter((cardColor: IMtgCardColorDto) => cardColor.color_type == "identity")
      .sort((a: IMtgCardColorDto, b: IMtgCardColorDto) => a.sequence - b.sequence);
    for (const item of cardColors) {
      this._coloridentitySortValue = this._coloridentitySortValue + item.sequence.toString().padStart(2, "0");
    }
  }
  //#endregion
}
