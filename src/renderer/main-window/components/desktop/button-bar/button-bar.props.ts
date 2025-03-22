import { EDesktopView } from "../desktop-view.enum";
import { IConfigurationDto } from "../../../../../common/dto";
import { Props } from "@blueprintjs/core";


export interface ButtonBarProps extends Props {
  afterSaveSettings: (saved: IConfigurationDto) => void;
  currentView: EDesktopView;
  onDesktopViewSelectionClick: (desktopView: EDesktopView) => void;
}
