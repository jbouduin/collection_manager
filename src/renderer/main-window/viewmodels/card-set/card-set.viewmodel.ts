import { DtoCardSet } from "../../../../common/dto";

export class CardSetViewmodel {
  //#region private readonly fields -------------------------------------------
  private readonly _dtoCardSet: DtoCardSet;
  //#endregion

  //#region public getters ----------------------------------------------------
  public get id(): string {
    return this._dtoCardSet.id;
  }

  public get setCode(): string {
    return this._dtoCardSet.code;
  }

  public get parentSetCode(): string {
    return this._dtoCardSet.parent_set_code;
  }

  public get treeItemLabel(): string {
    return `${this._dtoCardSet.name} (${this._dtoCardSet.card_count})`;
  }

  public get cardSetName(): string {
    return this._dtoCardSet.name;
  }

  public get cardSetSvg(): string {
    return this._dtoCardSet.svg;
  }
  //#endregion
  //#region public getters ----------------------------------------------------
  public constructor(dtoCardSet: DtoCardSet) {
    this._dtoCardSet = dtoCardSet;
  }
  //#endregion
}
