import { ButtonGroup, Menu, MenuItem } from "@blueprintjs/core";
import * as React from "react";

import { EDesktopView } from "../desktop-view.enum";
import { SettingsDialog } from "../settings-dialog/settings-dialog";
import { SyncDialog } from "../sync-dialog/sync-dialog";
import { ButtonBarButton } from "./button-bar-button";
import { EButtonBarButtonType } from "./button-bar-button-type.enum";
import { ButtonBarProps } from "./button-bar.props";
import { SplashScreen } from "../splash-screen/splash-screen";

// TODO active view white, inactive views mute
// TODO click on active view collapses the treeview
export function ButtonBar(props: ButtonBarProps) {

  //#region State ------------------------------------------------------------
  const [settingsDialogOpen, setSettingsDialogOpen] = React.useState(false);
  const [syncDialogOpen, setSyncDialogOpen] = React.useState(false);
  const [splashScreenOpen, setSplashScreenOpen] = React.useState(false);
  //#endregion

  //#region Event handling ----------------------------------------------------
  const onAnyButtonClick = (desktopView: EDesktopView) => props.onSelectButton(desktopView);
  //#endregion

  //#region Main --------------------------------------------------------------
  return (
    <>
      <div className="button-bar">
        <ButtonGroup minimal={true} vertical={true}>
          <ButtonBarButton
            buttonType={EButtonBarButtonType.TooltipButton}
            desktopView={EDesktopView.Database}
            assetPath="assets/img/mtg.svg"
            tooltip={<span>Magic the Gathering Database</span>}
            onButtonClick={onAnyButtonClick}
          />
          <ButtonBarButton
            buttonType={EButtonBarButtonType.TooltipButton}
            desktopView={EDesktopView.Collection}
            assetPath="assets/img/collection.svg"
            tooltip={<span>Collections</span>}
            onButtonClick={onAnyButtonClick}
          />
          <ButtonBarButton
            buttonType={EButtonBarButtonType.TooltipButton}
            desktopView={EDesktopView.Deck}
            assetPath="assets/img/deck.svg"
            tooltip={<span>Decks</span>}
            onButtonClick={onAnyButtonClick}
          />
        </ButtonGroup>
        <ButtonGroup minimal={true} vertical={true}>
          <ButtonBarButton
            buttonType={EButtonBarButtonType.MenuButton}
            menu={renderMenu()}
            assetPath="assets/img/settings.svg"
          />
        </ButtonGroup>
      </div>
      <SettingsDialog isOpen={settingsDialogOpen} onDialogClose={() => setSettingsDialogOpen(false)} />
      <SyncDialog isOpen={syncDialogOpen} onDialogClose={() => setSyncDialogOpen(false)} onOkClick={() => { setSyncDialogOpen(false), setSplashScreenOpen(true); }}/>
      <SplashScreen isOpen={splashScreenOpen} onDialogClose={()=> setSplashScreenOpen(false)} />
    </>
  );

  function renderMenu(): React.JSX.Element {
    return (
      <Menu small={true}>
        <MenuItem text="Settings" onClick={() => setSettingsDialogOpen(true)} />
        <MenuItem text="Synchronize" onClick={() => setSyncDialogOpen(true)} />
      </Menu>
    );
  }
  //#endregion
}
