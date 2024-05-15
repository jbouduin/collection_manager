import { ButtonGroup } from "@blueprintjs/core";
import * as React from "react";

import { ButtonBarButton } from "./button-bar-button";
import { ButtonBarProps } from "./button-bar.props";
import { EDesktopView } from "./desktop-view.enum";

export function ButtonBar(props: ButtonBarProps) {
  //#region Event handling ----------------------------------------------------
  function onAnyButtonClick(desktopView: EDesktopView): void {
    props.onSelectButton(desktopView);
  }
  //#endregion

  //#region Main --------------------------------------------------------------
  return (
    <div className="button-bar">
      <ButtonGroup minimal={true} vertical={true}>
        <ButtonBarButton
          desktopView={EDesktopView.Database}
          iconName="database"
          tooltip={<span>Magic the Gathering Database</span>}
          onButtonClick={onAnyButtonClick}
        />
        <ButtonBarButton
          desktopView={EDesktopView.Collection}
          iconName="box"
          tooltip={<span>Collections</span>}
          onButtonClick={onAnyButtonClick}
        />
        <ButtonBarButton
          desktopView={EDesktopView.Deck}
          iconName="box"
          tooltip={<span>Decks</span>}
          onButtonClick={onAnyButtonClick}
        />
      </ButtonGroup>
    </div>
  );
  //#endregion
}
