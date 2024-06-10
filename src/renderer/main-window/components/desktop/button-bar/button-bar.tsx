import { ButtonGroup, Menu, MenuItem } from "@blueprintjs/core";
import * as React from "react";

import { EDesktopView } from "../desktop-view.enum";
import { ButtonBarButton } from "./button-bar-button";
import { EButtonBarButtonType } from "./button-bar-button-type.enum";
import { ButtonBarProps } from "./button-bar.props";

// TODO active view white, inactive views mute
// TODO click on active view collapses the treeview
export function ButtonBar(props: ButtonBarProps) {

  //#region Event handling ----------------------------------------------------
  const onAnyButtonClick = (desktopView: EDesktopView) => props.onDesktopViewSelectionClick(desktopView);
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

    </>
  );

  function renderMenu(): React.JSX.Element {
    return (
      <Menu small={true}>
        <MenuItem text="Settings" onClick={() => props.onSettingsMenuClick()} />
        <MenuItem text="Synchronize" onClick={() => props.onSyncMenuClick()} />
      </Menu>
    );
  }
  //#endregion
}
