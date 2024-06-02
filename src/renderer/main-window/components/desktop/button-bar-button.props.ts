import { Props } from "@blueprintjs/core";

import { EDesktopView } from "./desktop-view.enum";

export interface ButtonBarButtonProps extends Props {
  desktopView: EDesktopView;
  assetPath: string;
  tooltip: React.JSX.Element;
  onButtonClick: (desktopView: EDesktopView) => void;
}
