import { LanguageDto, RendererConfigurationDto } from "../../../../common/dto";
import { CardConditionViewmodel, CardSetViewmodel } from "../../viewmodels";
import { EDesktopView } from "./desktop-view.enum";

export interface DesktopState {
  initialized: boolean;
  currentView: EDesktopView;
  cardSetDialogOpen: boolean;
  settingsDialogOpen: boolean;
  syncDialogOpen: boolean;
  splashScreenOpen: boolean;
  rendererConfiguration: RendererConfigurationDto;
  cardConditions: Array<CardConditionViewmodel>;
  cardSets: Array<CardSetViewmodel>;
  symbolSvgs: Map<string, string>;
  languages: Array<LanguageDto>;
}
