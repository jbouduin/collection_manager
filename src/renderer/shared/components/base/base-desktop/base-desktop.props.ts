import { Props } from "@blueprintjs/core";
import { DesktopContentProps } from "./desktop-content.props";

export interface BaseDesktopProps extends Props {
  desktopContent: (props: DesktopContentProps) => React.JSX.Element;
}
