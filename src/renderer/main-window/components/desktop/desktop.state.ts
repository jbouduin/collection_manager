import { CardConditionDto, GameFormatDto, LanguageDto, MtgCardSetDto, RendererConfigurationDto } from "../../../../common/dto";
import { EDesktopView } from "./desktop-view.enum";


export interface DesktopState {
  cardConditions: Array<CardConditionDto>;
  cardSets: Array<MtgCardSetDto>;
  currentView: EDesktopView;
  gameFormats: Array<GameFormatDto>;
  initialized: boolean;
  languages: Array<LanguageDto>;
  rendererConfiguration: RendererConfigurationDto;
  splashScreenOpen: boolean;
  symbolSvgs: Map<string, string>;
  themeClassName: string;
}
