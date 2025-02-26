import { Classes } from "@blueprintjs/core";

import { ConfigurationDto } from "../../../../common/dto";
import { BaseViewmodel } from "../base.viewmodel";
import { SyncParamViewmodel } from "../sync-param/sync-param.viewmodel";
import { DatabaseViewTreeConfigurationViewmodel } from "./database-view-tree-configuration.viewmodel";
import { DataConfigurationViewmodel } from "./data-configuration.viewmodel";

export class ConfigurationViewModel extends BaseViewmodel<ConfigurationDto> {
  //#region private fields ----------------------------------------------------
  private _syncParamViewmodel: SyncParamViewmodel;
  private _databaseViewTreeConfigurationViewmodel: DatabaseViewTreeConfigurationViewmodel;
  private _dataConfigurationViewmodel: DataConfigurationViewmodel;
  private readonly _isFirstUse: boolean;
  //#endregion

  //#region Auxiliary getters -------------------------------------------------
  public override get hasChanges(): boolean {
    return this._isFirstUse || super.hasChanges;
  }

  public get isFirstUse(): boolean {
    return this._isFirstUse;
  }
  //#endregion

  //#region Getters/Setters ---------------------------------------------------
  public get theme(): string {
    return this._dto.rendererConfiguration.useDarkTheme ? Classes.DARK : "";
  }

  public get syncParamViewmodel(): SyncParamViewmodel {
    return this._syncParamViewmodel;
  }

  public set syncParamViewmodel(value: SyncParamViewmodel) {
    this._syncParamViewmodel = value;
    this._dto.syncAtStartupConfiguration = value.dto;
  }

  public get databaseViewConfigurationViewmodel(): DatabaseViewTreeConfigurationViewmodel {
    return this._databaseViewTreeConfigurationViewmodel;
  }

  public set databaseViewConfigurationViewmodel(value: DatabaseViewTreeConfigurationViewmodel) {
    this._databaseViewTreeConfigurationViewmodel = value;
    this._dto.rendererConfiguration.databaseViewTreeConfiguration = value.dto;
  }

  public get dataConfigurationViewmodel(): DataConfigurationViewmodel {
    return this._dataConfigurationViewmodel;
  }

  public set dataConfigurationViewmodel(value: DataConfigurationViewmodel) {
    this._dataConfigurationViewmodel = value;
    this._dto.dataConfiguration = value.dto;
  }
  //#endregion

  //#region Constructor & C° --------------------------------------------------
  public constructor(dtoConfiguration: ConfigurationDto, isFirstUse: boolean) {
    super(dtoConfiguration);
    this._isFirstUse = isFirstUse;
    this._syncParamViewmodel = new SyncParamViewmodel(dtoConfiguration.syncAtStartupConfiguration);
    this._databaseViewTreeConfigurationViewmodel = new DatabaseViewTreeConfigurationViewmodel(dtoConfiguration.rendererConfiguration.databaseViewTreeConfiguration);
    this._dataConfigurationViewmodel = new DataConfigurationViewmodel(dtoConfiguration.dataConfiguration);
  }
  //#endregion
}
