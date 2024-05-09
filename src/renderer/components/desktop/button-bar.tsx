import { ButtonGroup } from "@blueprintjs/core";
import * as React from "react";

import { ButtonBarButton } from "./button-bar-button";
import { ButtonBarProps } from "./button-bar.props";
import { EDesktopView } from "./desktop-view.enum";


export class ButtonBar extends React.PureComponent<ButtonBarProps> {

  private onAnyButtonClick(desktopView: EDesktopView): void {
    this.props.onSelectButton(desktopView);
  }

  public render(): React.JSX.Element {
    return (
      <div className="button-bar">
        <ButtonGroup minimal={true} vertical={true}>
          <ButtonBarButton
            desktopView={EDesktopView.Database}
            iconName="database"
            tooltip={<span>Magic the Gathering Database</span>}
            onButtonClick={this.onAnyButtonClick.bind(this)}
          />
          <ButtonBarButton
            desktopView={EDesktopView.Collection}
            iconName="box"
            tooltip={<span>Collections</span>}
            onButtonClick={this.onAnyButtonClick.bind(this)}
          />
          <ButtonBarButton
            desktopView={EDesktopView.Deck}
            iconName="box"
            tooltip={<span>Decks</span>}
            onButtonClick={this.onAnyButtonClick.bind(this)}
          />
        </ButtonGroup>
      </div>
    );
  }
}
