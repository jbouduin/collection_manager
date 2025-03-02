import { LanguageDto, RendererConfigurationDto } from "../../../../common/dto";
import { CardConditionViewmodel, CardSetViewmodel } from "../../viewmodels";
import { EDesktopView } from "./desktop-view.enum";


export interface DesktopState {
  cardConditions: Array<CardConditionViewmodel>;
  cardSets: Array<CardSetViewmodel>;
  currentView: EDesktopView;
  initialized: boolean;
  languages: Array<LanguageDto>;
  rendererConfiguration: RendererConfigurationDto;
  splashScreenOpen: boolean;
  symbolSvgs: Map<string, string>;
  themeClassName: string;
}
