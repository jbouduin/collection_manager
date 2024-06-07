import { Classes } from "@blueprintjs/core";
import { cloneDeep, isEqual } from "lodash";

import { DtoConfiguration } from "../../../../common/dto/configuration/configuration.dto";
import { SyncType } from "../../../../common/ipc-params";

export class ConfigurationViewModel {

  //#region private fields ----------------------------------------------------
  private readonly _orgConfiguration: DtoConfiguration;
  private readonly _dtoConfiguration: DtoConfiguration;
  private _hasChanges: boolean;
  //#endregion

  //#region Auxiliary getters -------------------------------------------------
  public get dto(): DtoConfiguration {
    return this._dtoConfiguration;
  }
  public get hasChanges(): boolean {
    return this._hasChanges || !isEqual(this._dtoConfiguration, this._orgConfiguration);
  }
  //#endregion

  //#region Getters/Setters ---------------------------------------------------
  public get cacheDirectory(): string {
    return this._dtoConfiguration.mainConfiguration.cacheDirectory;
  }

  public set cacheDirectory(value: string) {
    this._dtoConfiguration.mainConfiguration.cacheDirectory = value;
  }

  public get databaseName(): string {
    return this._dtoConfiguration.mainConfiguration.databaseName;
  }

  public set databaseName(value: string) {
    this._dtoConfiguration.mainConfiguration.databaseName = value;
  }

  public get rootDataDirectory(): string {
    return this._dtoConfiguration.mainConfiguration.rootDataDirectory;
  }

  public set rootDataDirectory(value: string) {
     this._dtoConfiguration.mainConfiguration.rootDataDirectory = value;
  }

  public get theme(): string {
    return this._dtoConfiguration.rendererConfiguration.useDarkTheme ? Classes.DARK : "";
  }
  //#endregion

  //#region Constructor & C° --------------------------------------------------
  public constructor(dtoConfiguration: DtoConfiguration, hasChanges: boolean) {
    this._orgConfiguration = cloneDeep(dtoConfiguration);
    this._dtoConfiguration = dtoConfiguration;
    this._hasChanges = hasChanges;
  }
  //#endregion

  //#region Public methods ----------------------------------------------------
  public getSyncAtStartup(syncType: SyncType): boolean {
    return this._dtoConfiguration.mainConfiguration.syncAtStartup.indexOf(syncType) >= 0;
  }

  public setSyncAtStartup(syncType: SyncType, value: boolean) {
    if (value) {
      this._dtoConfiguration.mainConfiguration.syncAtStartup.push(syncType);
    } else {
      this._dtoConfiguration.mainConfiguration.syncAtStartup = this._dtoConfiguration.mainConfiguration.syncAtStartup
        .filter((s: SyncType) => s != syncType);
    }
  }
  //#endregion
}
