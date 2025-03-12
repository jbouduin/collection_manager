import { IConfigurationDto } from "../../../../common/dto";
import { IResult } from "../../base";


export interface IConfigurationService {
  readonly dataBaseFilePath: string;
  readonly isFirstUsage: boolean;
  readonly configuration: IConfigurationDto;

  getFactoryDefault(): Promise<IResult<IConfigurationDto>>;
  getSettings(): Promise<IResult<IConfigurationDto>>;
  loadSettings(appDirectory: string, homeDirectory: string, useDarkTheme: boolean): void;
  putSettings(settings: IConfigurationDto): Promise<IResult<IConfigurationDto>>;
  setSettings(settings: IConfigurationDto): Promise<IResult<IConfigurationDto>>;
}
