import { isEqual } from "lodash";


export class CommittableTextEditorViewmodel {
  //#region private fields ----------------------------------------------------
  private readonly _org: string | null;
  private readonly isNullable: boolean;
  private _value: string | null;
  //#endregion

  //#region Auxiliary Property ------------------------------------------------
  public get value(): string | null {
    return this._value;
  }

  //#endregion

  //#region Property value ----------------------------------------------------
  public get displayValue(): string {
    return this._value == null ? "" : this._value;
  }

  public set displayValue(value: string | null) {
    if (this.isNullable) {
      this._value = value == "" ? null : value;
    } else {
      this._value = value;
    }
  }
  //#endregion

  //#region Auxiliary getters -------------------------------------------------
  public get hasChanges(): boolean {
    const result = !isEqual(this._value, this._org) ? true : false;
    return result;
  }
  //#endregion

  //#region Constructor -------------------------------------------------------
  public constructor(value: string | null, isNullable: boolean) {
    this._value = value == null ? null : `${value}`;
    this._org = value;
    this.isNullable = isNullable;
  }
  //#endregion

  //#region Public methods ----------------------------------------------------
  public cancelChanges(): void {
    this._value = this._org == null ? null : `${this._org}`;
  }
  //#endregion
}
