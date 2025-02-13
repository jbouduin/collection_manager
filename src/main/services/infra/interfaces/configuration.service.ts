import { ConfigurationDto } from "../../../../common/dto";
import { IResult } from "../../base";

export interface IConfigurationService {
  readonly isFirstUsage: boolean;
  readonly configuration: ConfigurationDto;

  getFactoryDefault(): Promise<IResult<ConfigurationDto>>;
  getSettings(): Promise<IResult<ConfigurationDto>>;
  loadSettings(appDirectory: string, homeDirectory: string, useDarkTheme: boolean): void;
  putSettings(settings: ConfigurationDto): Promise<IResult<ConfigurationDto>>;
  setSettings(settings: ConfigurationDto): Promise<IResult<ConfigurationDto>>;
}
