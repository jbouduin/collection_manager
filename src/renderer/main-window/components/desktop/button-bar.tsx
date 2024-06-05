import { ButtonGroup } from "@blueprintjs/core";
import * as React from "react";

import { ButtonBarButton } from "./button-bar-button";
import { ButtonBarProps } from "./button-bar.props";
import { EDesktopView } from "./desktop-view.enum";

// TODO active view white, inactive views mute
// TODO click on active view collapses the treeview
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
          assetPath="assets/img/mtg.svg"
          tooltip={<span>Magic the Gathering Database</span>}
          onButtonClick={onAnyButtonClick}
        />
        <ButtonBarButton
          desktopView={EDesktopView.Collection}
          assetPath="assets/img/collection.svg"
          tooltip={<span>Collections</span>}
          onButtonClick={onAnyButtonClick}
        />
        <ButtonBarButton
          desktopView={EDesktopView.Deck}
          className={props.className}
          assetPath="assets/img/deck.svg"
          tooltip={<span>Decks</span>}
          onButtonClick={onAnyButtonClick}
        />
      </ButtonGroup>
    </div>
  );
  //#endregion
}
