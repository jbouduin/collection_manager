import { ICardConditionDto, IGameFormatDto, ILanguageDto, IMtgCardSetDto, IRendererConfigurationDto } from "../../../../../common/dto";


export interface BaseDesktopState {
  cardConditions: Array<ICardConditionDto>;
  cardSets: Array<IMtgCardSetDto>;
  gameFormats: Array<IGameFormatDto>;
  initialized: boolean;
  languages: Array<ILanguageDto>;
  rendererConfiguration: IRendererConfigurationDto;
  splashScreenOpen: boolean;
  symbolSvgs: Map<string, string>;
  themeClassName: string;
}
