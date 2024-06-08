import { Card } from "@blueprintjs/core";
import classNames from "classnames";
import { clone } from "lodash";
import * as React from "react";

import { CardSyncOptions, SyncParam } from "../../../../common/ipc-params";
import { CardSetContext, CardSymbolContext, LanguagesContext, ThemeContext } from "../context";
import { CollectionView } from "../views/collection-view/collection-view";
import { DatabaseView } from "../views/database-view/database-view";
import { DeckView } from "../views/deck-view/deck-view";
import { ButtonBar } from "./button-bar/button-bar";
import { EDesktopView } from "./desktop-view.enum";
import { DesktopProps } from "./desktop.props";
import { DesktopState } from "./desktop.state";
import { SettingsDialog } from "./settings-dialog/settings-dialog";
import { SplashScreen } from "./splash-screen/splash-screen";
import { SyncDialog } from "./sync-dialog/sync-dialog";

// import logo from "./logo.png";


export function Desktop(props: DesktopProps) {
  console.log("in desktop function");

  //#region State -------------------------------------------------------------
  const initialState: DesktopState = {
    currentView: EDesktopView.Database,
    settingsDialogOpen: false,
    syncDialogOpen: false,
    splashScreenOpen: false
  };
  const [desktopState, setDesktopState] = React.useState < DesktopState>(initialState);
  //#endregion

  //#region Event handling ----------------------------------------------------
  function onDesktopViewSelectionClick(desktopView: EDesktopView): void {
    console.log("in desktop buttonbar button click event:", desktopView);
    const newState = clone(desktopState);
    newState.currentView = desktopView;
    setDesktopState(newState);
  }

  function setSettingsDialogOpen(open: boolean): void {
    const newState = clone(desktopState);
    newState.settingsDialogOpen = open;
    setDesktopState(newState);
  }

  function setSyncDialogOpen(open: boolean): void {
    const newState = clone(desktopState);
    newState.syncDialogOpen = open;
    setDesktopState(newState);
  }

  function setSplashScreenOpen(open: boolean): void {
    const newState = clone(desktopState);
    newState.splashScreenOpen = open;
    if (open) {
      newState.syncDialogOpen = false;
    }
    setDesktopState(newState);
  }

  function synchronizeSet(code: string): void {
    const newState = clone(desktopState);
    newState.splashScreenOpen = true;
    setDesktopState(newState);

    const params: SyncParam<CardSyncOptions> = {
      type: "Card",
      options: { source: "user", setCode: code }
    };
    console.log("before");
    window.ipc.sync(params);
    console.log("after");
  }
  //#endregion

  //#region Main --------------------------------------------------------------
  return (
    <ThemeContext.Provider value={props.systemTheme}>
      <LanguagesContext.Provider value={props.languages}>
        <CardSymbolContext.Provider value={props.symbolSvgs}>
          <CardSetContext.Provider value={props.cardSets}>
            <Card className={classNames(props.systemTheme, "desktop-wrapper")}>
              <ButtonBar
                onDesktopViewSelectionClick={onDesktopViewSelectionClick}
                onSettingsMenuClick={() => setSettingsDialogOpen(true)}
                onSyncMenuClick={() => setSyncDialogOpen(true)}
                currentView={desktopState.currentView}></ButtonBar>
              <div className="main-panel">
                {
                  desktopState.currentView == EDesktopView.Database &&
                  <DatabaseView onSynchronizeSet={synchronizeSet} />
                }
                {
                  desktopState.currentView == EDesktopView.Collection &&
                  <CollectionView />
                }
                {
                  desktopState.currentView == EDesktopView.Deck &&
                  <DeckView />
                }
              </div>
            </Card>
            <SettingsDialog isOpen={desktopState.settingsDialogOpen} onDialogClose={() => setSettingsDialogOpen(false)} />
            <SyncDialog isOpen={desktopState.syncDialogOpen} onDialogClose={() => setSyncDialogOpen(false)} onOkClick={() => { setSplashScreenOpen(true); }} />
            <SplashScreen isOpen={desktopState.splashScreenOpen} onDialogClose={() => setSplashScreenOpen(false)} />
          </CardSetContext.Provider>
        </CardSymbolContext.Provider>
      </LanguagesContext.Provider>
    </ThemeContext.Provider>
  );
  //#endregion
}
