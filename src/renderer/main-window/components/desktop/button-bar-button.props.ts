import { IconName, Props } from "@blueprintjs/core";
import { EDesktopView } from "./desktop-view.enum";

export interface ButtonBarButtonProps extends Props {
  desktopView: EDesktopView;
  iconName: IconName;
  tooltip: React.JSX.Element;
  onButtonClick: (desktopView: EDesktopView) => void;
}
