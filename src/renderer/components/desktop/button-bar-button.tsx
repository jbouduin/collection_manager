import { Button, IconName, Props, Tooltip } from "@blueprintjs/core";
import * as React from "react";

import { EDesktopView } from "./desktop-view.enum";

export interface ButtonBarButtonProps extends Props {
  desktopView: EDesktopView;
  iconName: IconName;
  tooltip: React.JSX.Element;
  onButtonClick: (desktopView: EDesktopView) => void;
}

export class ButtonBarButton extends React.PureComponent<ButtonBarButtonProps> {

  private onButtonClick(): void {
    this.props.onButtonClick(this.props.desktopView);
  }

  public render(): React.JSX.Element {
    return (
      <div><Tooltip
        content={this.props.tooltip}
        openOnTargetFocus={false}
        placement="right"
        usePortal={false}>
        <Button icon={this.props.iconName} onClick={this.onButtonClick.bind(this)}></Button>
      </Tooltip>
      </div>
    );
  }
}
