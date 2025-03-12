import { IDeckDto } from "../../../../common/dto";
import { MtgGameFormat } from "../../../../common/types";
import { BaseViewmodel } from "../../../shared/viewmodels";

export class DeckViewmodel extends BaseViewmodel<IDeckDto> {
  //#region Getters/Setters -----------------------------------------------
  public get description(): string {
    return this._dto.description;
  }

  public set description(value: string) {
    this._dto.description = value;
  }

  public get id(): number {
    return this._dto.id;
  }

  public get isFolder(): boolean {
    return this._dto.is_folder;
  }

  public get name(): string {
    return this._dto.name;
  }

  public set name(value: string) {
    this._dto.name = value;
  }

  public get targetFormat(): MtgGameFormat {
    return this._dto.target_format;
  }

  public set targetFormat(value: MtgGameFormat) {
    this._dto.target_format = value;
  }
  //#endregion
}
