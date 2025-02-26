import { LanguageDto, RendererConfigurationDto } from "../../../../common/dto";
import { CardConditionViewmodel, CardSetViewmodel } from "../../viewmodels";
import { EDesktopView } from "./desktop-view.enum";

export type AfterSplashScreenClose = "CardSets" | "CardSymbols";

export interface DesktopState {
  afterSplashScreenClose: Array<AfterSplashScreenClose>;
  cardConditions: Array<CardConditionViewmodel>;
  cardSets: Array<CardSetViewmodel>;
  cardSetDialogOpen: boolean;
  currentView: EDesktopView;
  initialized: boolean;
  languages: Array<LanguageDto>;
  rendererConfiguration: RendererConfigurationDto;
  settingsDialogOpen: boolean;
  splashScreenOpen: boolean;
  symbolSvgs: Map<string, string>;
  syncDialogOpen: boolean;
}
