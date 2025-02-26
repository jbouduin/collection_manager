import { ButtonGroup, Menu, MenuItem } from "@blueprintjs/core";
import * as React from "react";
import { EDesktopView } from "../desktop-view.enum";
import { ButtonBarButton } from "./button-bar-button";
import { EButtonBarButtonType } from "./button-bar-button-type.enum";
import { ButtonBarProps } from "./button-bar.props";

/*
 * TODO active view white, inactive views mute
 * TODO click on active view collapses the treeview
 */
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
            assetPath="assets/img/mtg.svg"
            buttonType={EButtonBarButtonType.TooltipButton}
            desktopView={EDesktopView.Database}
            onButtonClick={onAnyButtonClick}
            tooltip={<span>Magic the Gathering Database</span>}
          />
          <ButtonBarButton
            assetPath="assets/img/collection.svg"
            buttonType={EButtonBarButtonType.TooltipButton}
            desktopView={EDesktopView.Collection}
            onButtonClick={onAnyButtonClick}
            tooltip={<span>Collections</span>}
          />
          <ButtonBarButton
            assetPath="assets/img/deck.svg"
            buttonType={EButtonBarButtonType.TooltipButton}
            desktopView={EDesktopView.Deck}
            onButtonClick={onAnyButtonClick}
            tooltip={<span>Decks</span>}
          />
        </ButtonGroup>
        <ButtonGroup minimal={true} vertical={true}>
          <ButtonBarButton
            assetPath="assets/img/settings.svg"
            buttonType={EButtonBarButtonType.MenuButton}
            menu={renderMenu()}
          />
        </ButtonGroup>
      </div>
    </>
  );

  function renderMenu(): React.JSX.Element {
    return (
      <Menu small={true}>
        <MenuItem onClick={() => props.onSettingsMenuClick()} text="Settings" />
        <MenuItem onClick={() => props.onSyncMenuClick()} text="Synchronize" />
      </Menu>
    );
  }
  //#endregion
}
