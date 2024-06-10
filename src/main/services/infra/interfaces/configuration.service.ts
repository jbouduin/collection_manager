import { DtoConfiguration, DtoSyncParam } from "../../../../common/dto";

export interface IConfigurationService {
  readonly isFirstUsage: boolean;
  readonly dataBaseFilePath: string;
  readonly cacheDirectory: string;
  readonly configuration: DtoConfiguration;
  readonly syncAtStartup: DtoSyncParam;

  loadConfiguration(appDirectory: string, homeDirectory: string, useDarkTheme: boolean): void;
  saveConfiguration(configuration: DtoConfiguration): boolean;
}
