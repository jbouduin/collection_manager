import { Props } from "@blueprintjs/core";

import { EDesktopView } from "../desktop-view.enum";

export interface ButtonBarProps extends Props {
  currentView: EDesktopView;
  onSelectButton: (desktopView: EDesktopView) => void
}
