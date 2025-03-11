import { MtgCardListDto, MtgCardDetailDto, OwnedCardListDto, DeckCardListDto, OracleDto, MtgCardfaceDto } from "../../../../common/dto";
import { CardRarity } from "../../../../common/types";

export abstract class BaseMtgCardViewmodel<T extends MtgCardListDto | MtgCardDetailDto | OwnedCardListDto | DeckCardListDto> {
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

  /**
   * The highest CMC of both cardfaces
   * TODO: check if there are many cards in the db that have two faces, but the cmc on card level anyway
   * Currently this happens with cards that have a cmc on only one of both faces.
   */
  public get convertedManaCostSortValue(): number {
    return this._dtoCard.cardfaces
      .map((cardFace: MtgCardfaceDto) => {
        return cardFace.cmc ? cardFace.cmc : -1;
      })
      .reduce(
        (prev: number, curr: number) => {
          return (curr > prev) ? curr : prev;
        },
        -1
      );
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
