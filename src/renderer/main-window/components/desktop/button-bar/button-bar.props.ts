import { Props } from "@blueprintjs/core";

import { EDesktopView } from "../desktop-view.enum";

export interface ButtonBarProps extends Props {
  currentView: EDesktopView;
  onDesktopViewSelectionClick: (desktopView: EDesktopView) => void;
  onSettingsMenuClick: () => void;
  onSyncMenuClick: () => void;
}
