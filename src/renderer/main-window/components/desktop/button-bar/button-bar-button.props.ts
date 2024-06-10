import { Props } from "@blueprintjs/core";

import { EDesktopView } from "../desktop-view.enum";
import { EButtonBarButtonType } from "./button-bar-button-type.enum";

export interface ButtonBarButtonProps extends Props {
  assetPath: string;
  buttonType: EButtonBarButtonType;
  desktopView?: EDesktopView;
  tooltip?: React.JSX.Element;
  onButtonClick?: (desktopView: EDesktopView) => void;
  menu?: React.JSX.Element;
}
