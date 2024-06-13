import { Classes } from "@blueprintjs/core";

import { DtoConfiguration } from "../../../../common/dto/configuration/configuration.dto";
import { BaseViewmodel } from "../base.viewmodel";
import { SyncParamViewmodel } from "../sync-param/sync-param.viewmodel";
import { DatabaseViewConfigurationViewmodel } from "./database-view-configuration.viewmodel";

export class ConfigurationViewModel extends BaseViewmodel<DtoConfiguration> {

  //#region private fields ----------------------------------------------------
  private _syncParamViewmodel: SyncParamViewmodel;
  private _databaseConfigurationViewViewmodel: DatabaseViewConfigurationViewmodel;
  private _hasChanges: boolean;
  //#endregion

  //#region Auxiliary getters -------------------------------------------------
  public override get hasChanges(): boolean {
    return this._hasChanges || super.hasChanges;
  }
  //#endregion

  //#region Getters/Setters ---------------------------------------------------
  public get cacheDirectory(): string {
    return this._dto.mainConfiguration.cacheDirectory;
  }

  public set cacheDirectory(value: string) {
    this._dto.mainConfiguration.cacheDirectory = value;
  }

  public get databaseName(): string {
    return this._dto.mainConfiguration.databaseName;
  }

  public set databaseName(value: string) {
    this._dto.mainConfiguration.databaseName = value;
  }

  public get rootDataDirectory(): string {
    return this._dto.mainConfiguration.rootDataDirectory;
  }

  public set rootDataDirectory(value: string) {
     this._dto.mainConfiguration.rootDataDirectory = value;
  }

  public get theme(): string {
    return this._dto.rendererConfiguration.useDarkTheme ? Classes.DARK : "";
  }

  public get syncParamViewmodel(): SyncParamViewmodel {
    return this._syncParamViewmodel;
  }

  public set syncParamViewmodel(value: SyncParamViewmodel) {
    this._syncParamViewmodel = value;
    this._dto.mainConfiguration.syncAtStartup = value.dto;
  }

  public get databaseViewConfigurationViewmodel(): DatabaseViewConfigurationViewmodel {
    return this._databaseConfigurationViewViewmodel;
  }

  public set databaseViewConfigurationViewmodel(value: DatabaseViewConfigurationViewmodel) {
    this._databaseConfigurationViewViewmodel = value;
    this._dto.rendererConfiguration.databaseViewConfiguration = value.dto;
  }
  //#endregion

  //#region Constructor & C° --------------------------------------------------
  public constructor(dtoConfiguration: DtoConfiguration, hasChanges: boolean) {
    super(dtoConfiguration);
    this._hasChanges = hasChanges;
    this._syncParamViewmodel = new SyncParamViewmodel(dtoConfiguration.mainConfiguration.syncAtStartup);
    this._databaseConfigurationViewViewmodel = new DatabaseViewConfigurationViewmodel(dtoConfiguration.rendererConfiguration.databaseViewConfiguration);
  }
  //#endregion

  //#region Public methods ----------------------------------------------------
  //#endregion
}
