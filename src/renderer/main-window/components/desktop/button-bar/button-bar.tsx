import { ButtonGroup } from "@blueprintjs/core";
import * as React from "react";

import { EDesktopView } from "../desktop-view.enum";
import { SettingsDialog } from "../settings-dialog/settings-dialog";
import { ButtonBarButton } from "./button-bar-button";
import { ButtonBarProps } from "./button-bar.props";

// TODO active view white, inactive views mute
// TODO click on active view collapses the treeview
export function ButtonBar(props: ButtonBarProps) {

  //#region State ------------------------------------------------------------
  const [settingsDialogState, setSettingsDialogState] = React.useState(false);
  //#endregion

  //#region Event handling ----------------------------------------------------
  const onAnyButtonClick = React.useCallback(
    (desktopView: EDesktopView) => {
      props.onSelectButton(desktopView);
    },
    []
  );

  const onSettingsButtonClick = React.useCallback(
    () => setSettingsDialogState(true),
    []
  );

  const onCloseSettingsDialog = React.useCallback(
    () => setSettingsDialogState(false),
    []
  );
  //#endregion

  //#region Main --------------------------------------------------------------
  return (
    <>
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
            assetPath="assets/img/deck.svg"
            tooltip={<span>Decks</span>}
            onButtonClick={onAnyButtonClick}
          />
        </ButtonGroup>
        <ButtonGroup minimal={true} vertical={true}>
          <ButtonBarButton
            desktopView={props.currentView}
            assetPath="assets/img/settings.svg"
            tooltip={<span>Settings</span>}
            onButtonClick={onSettingsButtonClick}
          />
        </ButtonGroup>
      </div>
      <SettingsDialog isOpen={settingsDialogState} settingsDialogClose={onCloseSettingsDialog} />
    </>
  );
  //#endregion
}
