import { IMtgCardSetDto } from "../../../../common/dto";
import { CardSetType } from "../../../../common/types";

/**
 * Use a view model for MtgCardSet, so we do not assign something by accident
 */
export class CardSetViewmodel {
  //#region private readonly fields -------------------------------------------
  private readonly _dtoCardSet: IMtgCardSetDto;
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

  public get cardSetType(): CardSetType {
    return this._dtoCardSet.set_type;
  }

  public get releaseDateIsoString(): string {
    return new Date(this._dtoCardSet.released_at).toISOString();
  }

  public get block(): string {
    return this._dtoCardSet.block;
  }
  //#endregion

  //#region public getters ----------------------------------------------------
  public constructor(dtoCardSet: IMtgCardSetDto) {
    this._dtoCardSet = dtoCardSet;
  }
  //#endregion
}
