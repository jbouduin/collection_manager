import { CardfaceDto } from "../../../../common/dto";
import { OracleViewmodel } from "../oracle/oracle-viewmodel";

export class CardfaceViewmodel {
  //#region private readonly fields -------------------------------------------
  private readonly _dtoCardface: CardfaceDto;
  private readonly _manaCost: Array<string>;
  private readonly _oracle: OracleViewmodel;
  //#endregion

  //#region Public getters -----------------------------------------------------
  public get printedName(): string {
    // here we have a data quality issue with non english split cards
    return this._dtoCardface.printed_name.indexOf(" // ") >= 0
      ? this._dtoCardface.face_name
      : this._dtoCardface.printed_name;
  }

  public get printedTypeLine(): string {
    return this._dtoCardface.printed_type_line;
  }

  public get manaCost(): Array<string> {
    return this._manaCost;
  }

  public get hasFlavorText(): boolean {
    return this._dtoCardface.flavor_text?.length > 0;
  }

  public get flavorText(): string {
    return this._dtoCardface.flavor_text;
  }

  public get printedText(): string {
    return this._dtoCardface.printed_text;
  }

  public get sequence(): number {
    return this._dtoCardface.sequence;
  }

  public get cardId(): string {
    return this._dtoCardface.card_id;
  }

  public get oracle(): OracleViewmodel {
    return this._oracle;
  }
  //#endregion

  //#region Constructor & C° --------------------------------------------------
  public constructor(dtoCardface: CardfaceDto) {
    this._dtoCardface = dtoCardface;
    this._manaCost = this.convertManaCost(dtoCardface.mana_cost);
    this._oracle = new OracleViewmodel(dtoCardface.oracle);
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
}
