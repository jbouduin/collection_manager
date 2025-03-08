import { CardConditionDto, DeckDetailsDto, GameFormatDto, LanguageDto, MtgCardSetDto, RendererConfigurationDto } from "../../../../common/dto";


export interface DesktopState {
  cardConditions: Array<CardConditionDto>;
  cardSets: Array<MtgCardSetDto>;
  deck: DeckDetailsDto;
  initialized: boolean;
  gameFormats: Array<GameFormatDto>;
  languages: Array<LanguageDto>;
  rendererConfiguration: RendererConfigurationDto;
  splashScreenOpen: boolean;
  symbolSvgs: Map<string, string>;
  themeClassName: string;
}
