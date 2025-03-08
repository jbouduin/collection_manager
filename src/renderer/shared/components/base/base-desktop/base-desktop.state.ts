import { CardConditionDto, GameFormatDto, LanguageDto, MtgCardSetDto, RendererConfigurationDto } from "../../../../../common/dto";


export interface BaseDesktopState {
  cardConditions: Array<CardConditionDto>;
  cardSets: Array<MtgCardSetDto>;
  gameFormats: Array<GameFormatDto>;
  initialized: boolean;
  languages: Array<LanguageDto>;
  rendererConfiguration: RendererConfigurationDto;
  splashScreenOpen: boolean;
  symbolSvgs: Map<string, string>;
  themeClassName: string;
}
