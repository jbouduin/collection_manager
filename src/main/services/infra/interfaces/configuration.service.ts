import { DtoConfiguration } from "../../../../common/dto/configuration/configuration.dto";
import { SyncType } from "../../../../common/ipc-params";

export interface IConfigurationService {
  readonly isFirstUsage: boolean;
  readonly dataBaseFilePath: string;
  readonly cacheDirectory: string;
  readonly configuration: DtoConfiguration;
  readonly syncAtStartup: Array<SyncType>;

  loadConfiguration(appDirectory: string, homeDirectory: string, useDarkTheme: boolean): void;
  saveConfiguration(configuration: DtoConfiguration): boolean;
}
