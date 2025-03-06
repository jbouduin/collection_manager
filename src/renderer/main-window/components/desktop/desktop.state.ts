import { CardConditionDto, LanguageDto, MtgCardSetDto, RendererConfigurationDto } from "../../../../common/dto";

import { EDesktopView } from "./desktop-view.enum";


export interface DesktopState {
  // NOW switch to Dto
  cardConditions: Array<CardConditionDto>;
  cardSets: Array<MtgCardSetDto>;
  currentView: EDesktopView;
  initialized: boolean;
  languages: Array<LanguageDto>;
  rendererConfiguration: RendererConfigurationDto;
  splashScreenOpen: boolean;
  symbolSvgs: Map<string, string>;
  themeClassName: string;
}
