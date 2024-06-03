import { CardSetType } from "../../../../common/enums";
import { DtoCardSet } from "../../../../common/dto";

export class CardSetViewmodel {
  //#region private readonly fields -------------------------------------------
  private readonly _dtoCardSet: DtoCardSet;
  //#endregion

  //#region public getters ----------------------------------------------------
  // NOW cleanup properties that are not required
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
    // TODO date and datetime issues
    return new Date(this._dtoCardSet.released_at).toISOString();
  }

  public get releaseDate(): Date {
    // TODO date and datetime issues
    return new Date(this._dtoCardSet.released_at);
  }
  public get block(): string {
    return this._dtoCardSet.block;
  }

  public get scryFallUri(): string {
    return this._dtoCardSet.scryfall_uri;
  }


  //#endregion

  //#region public getters ----------------------------------------------------
  public constructor(dtoCardSet: DtoCardSet) {
    this._dtoCardSet = dtoCardSet;
  }
  //#endregion
}
