import { cloneDeep, isEqual } from "lodash";

export abstract class BaseViewmodel<T extends object> {
  //#region protected fields ----------------------------------------------------
  protected _dto: T;
  protected readonly _org: T;
  //#endregion

  //#endregion

  //#region Auxiliary getters -------------------------------------------------
  public get dto(): Readonly<T> {
    return this._dto;
  }

  public get hasChanges(): boolean {
    return !isEqual(this._dto, this._org);
  }
  //#endregion

  //#region Constructor -------------------------------------------------------
  public constructor(dto: T) {
    this._dto = dto;
    this._org = cloneDeep(dto);
  }
  //#endregion

  //#region Public methods ----------------------------------------------------
  public cancelChanges(): void {
    this._dto = cloneDeep(this._org);
  }
  //#endregion
}
