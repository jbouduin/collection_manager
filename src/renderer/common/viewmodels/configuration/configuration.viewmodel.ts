import { Classes } from "@blueprintjs/core";
import { DtoConfiguration } from "../../../../common/dto/configuration/configuration.dto";
import { SyncType } from "../../../../common/ipc-params";

export class ConfigurationViewModel {

  private readonly _dtoConfiguration: DtoConfiguration;
  private _hasChanges: boolean;

  public get cacheDirectory(): string {
    return this._dtoConfiguration.mainConfiguration.cacheDirectory;
  }

  public get databaseName(): string {
    return this._dtoConfiguration.mainConfiguration.databaseName;
  }

  public get hasChanges(): boolean {
    return this._hasChanges;
  }

  public get rootDataDirectory(): string {
    return this._dtoConfiguration.mainConfiguration.rootDataDirectory;
  }

  public get theme(): string {
    return this._dtoConfiguration.rendererConfiguration.useDarkTheme ? Classes.DARK : "";
  }

  public getSyncAtStartup(syncType: SyncType): boolean {
    return this._dtoConfiguration.mainConfiguration.syncAtStartup.indexOf(syncType) >= 0;
  }

  public constructor(dtoConfiguration: DtoConfiguration, hasChanges: boolean) {
    this._dtoConfiguration = dtoConfiguration;
    this._hasChanges = hasChanges;
  }


}
