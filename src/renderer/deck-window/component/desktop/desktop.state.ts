import { CardConditionDto, DeckDetailsDto, LanguageDto, MtgCardSetDto, RendererConfigurationDto } from "../../../../common/dto";


export interface DesktopState {
  cardConditions: Array<CardConditionDto>;
  cardSets: Array<MtgCardSetDto>;
  deck: DeckDetailsDto;
  initialized: boolean;
  languages: Array<LanguageDto>;
  rendererConfiguration: RendererConfigurationDto;
  splashScreenOpen: boolean;
  symbolSvgs: Map<string, string>;
  themeClassName: string;
}
