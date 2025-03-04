import { DtoDataConfiguration } from "../../../../common/dto";
import { BaseViewmodel } from "../base.viewmodel";

export class DataConfigurationViewmodel extends BaseViewmodel<DtoDataConfiguration> {
  //#region Getters/Setters ---------------------------------------------------
  public get cacheDirectory(): string {
    return this._dto.cacheDirectory;
  }

  public set cacheDirectory(value: string) {
    this._dto.cacheDirectory = value;
  }

  public get databaseName(): string {
    return this._dto.databaseName;
  }

  public set databaseName(value: string) {
    this._dto.databaseName = value;
  }

  public get rootDataDirectory(): string {
    return this._dto.rootDataDirectory;
  }

  public set rootDataDirectory(value: string) {
    this._dto.rootDataDirectory = value;
  }
  //#endregion

  //#region Constructor & C° --------------------------------------------------
  public constructor(dtoDataConfiguration: DtoDataConfiguration) {
    super(dtoDataConfiguration);
  }
  //#endregion
}
