import { ButtonGroup, Menu, MenuItem } from "@blueprintjs/core";
import * as React from "react";
import { ConfigurationDto, SyncParamDto } from "../../../../../common/dto";
import { AfterSplashScreenClose } from "../../../../common/collection-manager.props";
import { IpcProxyService, IpcProxyServiceContext } from "../../../../common/context";
import { EDesktopView } from "../desktop-view.enum";
import { SettingsDialog } from "../settings-dialog/settings-dialog";
import { SyncDialog } from "../sync-dialog/sync-dialog";
import { ButtonBarButton } from "./button-bar-button";
import { EButtonBarButtonType } from "./button-bar-button-type.enum";
import { ButtonBarProps } from "./button-bar.props";
import { ButtonBarState } from "./button-bar.state";


/*
 * TODO active view white, inactive views mute
 * TODO click on active view collapses the treeview
 */
export function ButtonBar(props: ButtonBarProps) {
  //#region State -----------------------------------------------------------------------
  const initialState: ButtonBarState = { syncDialogOpen: false, settingsDialogOpen: false };
  const [state, setState] = React.useState<ButtonBarState>(initialState);
  //#endregion

  //#region Context ---------------------------------------------------------------------
  const ipcProxyService = React.useContext<IpcProxyService>(IpcProxyServiceContext);
  //#endregion

  //#region Event handling --------------------------------------------------------------
  function startSync(syncParam: SyncParamDto): void {
    props.showSplashScreen();
    setState(initialState);
    void ipcProxyService
      .postData<SyncParamDto, never>("/mtg-sync", syncParam)
      .then(
        () => {
          if (syncParam.syncCardSets || syncParam.syncCardSymbols) {
            const afterSplashScreenClose = new Array<AfterSplashScreenClose>();
            if (syncParam.syncCardSets) {
              afterSplashScreenClose.push("CardSets");
            }
            if (syncParam.syncCardSymbols) {
              afterSplashScreenClose.push("CardSymbols");
            }
            props.hideSplashScreen(afterSplashScreenClose);
          } else {
            props.hideSplashScreen(null);
          }
        },
        () => props.hideSplashScreen(null)
      );
  }
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
            onButtonClick={(desktopView: EDesktopView) => props.onDesktopViewSelectionClick(desktopView)}
            tooltip={<span>Magic the Gathering Database</span>}
          />
          <ButtonBarButton
            assetPath="assets/img/collection.svg"
            buttonType={EButtonBarButtonType.TooltipButton}
            desktopView={EDesktopView.Collection}
            onButtonClick={(desktopView: EDesktopView) => props.onDesktopViewSelectionClick(desktopView)}
            tooltip={<span>Collections</span>}
          />
          <ButtonBarButton
            assetPath="assets/img/deck.svg"
            buttonType={EButtonBarButtonType.TooltipButton}
            desktopView={EDesktopView.Deck}
            onButtonClick={(desktopView: EDesktopView) => props.onDesktopViewSelectionClick(desktopView)}
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
      {
        state.settingsDialogOpen &&
        <SettingsDialog
          afterSave={(saved: ConfigurationDto) => {
            props.afterSaveSettings(saved);
            setState(initialState);
          }}
          isOpen={state.settingsDialogOpen}
          onDialogClose={() => setState(initialState)}
        />
      }
      {
        state.syncDialogOpen &&
        <SyncDialog
          isOpen={state.syncDialogOpen}
          onDialogClose={() => setState(initialState)}
          onOkClick={startSync}
        />
      }
    </>
  );

  function renderMenu(): React.JSX.Element {
    return (
      <Menu small={true}>
        <MenuItem onClick={() => setState({ syncDialogOpen: false, settingsDialogOpen: true })} text="Settings" />
        <MenuItem onClick={() => setState({ syncDialogOpen: true, settingsDialogOpen: false })} text="Synchronize" />
      </Menu>
    );
  }
  //#endregion
}
