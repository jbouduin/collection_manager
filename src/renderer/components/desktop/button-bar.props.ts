import { Props } from "@blueprintjs/core";

import { EDesktopView } from "./desktop-view.enum";

export interface ButtonBarProps extends Props {
  onSelectButton: (desktopView: EDesktopView) => void
}
