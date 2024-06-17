import { Card, Classes } from "@blueprintjs/core";
import classNames from "classnames";
import { clone } from "lodash";
import * as React from "react";

import { DtoSyncParam } from "../../../../common/dto";
import { CardSetViewmodel } from "../../viewmodels";
import { CardSetContext, CardSymbolContext, LanguagesContext, ConfigurationContext } from "../context";
import { CollectionView } from "./views/collection-view/collection-view";
import { DeckView } from "./views/deck-view/deck-view";
import { ButtonBar } from "./button-bar/button-bar";
import { CardSetDialog } from "./card-set-dialog/card-set-dialog";
import { EDesktopView } from "./desktop-view.enum";
import { DesktopProps } from "./desktop.props";
import { DesktopState } from "./desktop.state";
import { SettingsDialog } from "./settings-dialog/settings-dialog";
import { SplashScreen } from "./splash-screen/splash-screen";
import { SyncDialog } from "./sync-dialog/sync-dialog";
import { DatabaseView } from "./views/database-view/database-view";

// import logo from "./logo.png";


export function Desktop(props: DesktopProps) {
  console.log("in desktop function");

  //#region State -------------------------------------------------------------
  const initialState: DesktopState = {
    currentView: EDesktopView.Database,
    settingsDialogOpen: false,
    syncDialogOpen: false,
    splashScreenOpen: false,
    cardSetDialogOpen: false,
    cardSet: null
  };
  const [desktopState, setDesktopState] = React.useState<DesktopState>(initialState);
  //#endregion

  //#region Event handling ----------------------------------------------------
  function onDesktopViewSelectionClick(desktopView: EDesktopView): void {
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

  function setCardSetDialogOpen(open: boolean, cardSet?: CardSetViewmodel): void {
    const newState = clone(desktopState);
    newState.cardSetDialogOpen = open;
    newState.cardSet = cardSet;
    setDesktopState(newState);
  }

  function synchronizeSet(code: string): void {
    const newState = clone(desktopState);
    newState.splashScreenOpen = true;
    setDesktopState(newState);

    const params: DtoSyncParam = {
      catalogTypesToSync: [],
      syncCardSymbols: false,
      syncCardSets: false,
      rulingSyncType: "none",
      cardSyncType: "byCardSet",
      cardSelectionToSync: [],
      cardImageStatusToSync: [],
      syncCardsSyncedBeforeNumber: undefined,
      syncCardsSyncedBeforeUnit: undefined,
      cardSetCodeToSyncCardsFor: code,
      changedImageStatusAction: "delete"
    };
    window.ipc.sync(params);
  }

  function synchronizeCollection(ids: Array<string>): void {
    const newState = clone(desktopState);
    newState.splashScreenOpen = true;
    setDesktopState(newState);

    const params: DtoSyncParam = {
      catalogTypesToSync: [],
      syncCardSymbols: false,
      syncCardSets: false,
      rulingSyncType: "none",
      cardSyncType: "collection",
      cardSelectionToSync: ids,
      cardImageStatusToSync: [],
      syncCardsSyncedBeforeNumber: undefined,
      syncCardsSyncedBeforeUnit: undefined,
      cardSetCodeToSyncCardsFor: undefined,
      changedImageStatusAction: "delete"
    };
    window.ipc.sync(params);
  }

  function startSync(syncParam: DtoSyncParam): void {
    setSplashScreenOpen(true);
    window.ipc.sync(syncParam);
  }
  //#endregion

  //#region Main --------------------------------------------------------------
  return (
    <ConfigurationContext.Provider value={props.configuration}>
      <LanguagesContext.Provider value={props.languages}>
        <CardSymbolContext.Provider value={props.symbolSvgs}>
          <CardSetContext.Provider value={props.cardSets}>
            <Card className={classNames(props.configuration.useDarkTheme ? Classes.DARK: "", "desktop-wrapper")}>
              <ButtonBar
                onDesktopViewSelectionClick={onDesktopViewSelectionClick}
                onSettingsMenuClick={() => setSettingsDialogOpen(true)}
                onSyncMenuClick={() => setSyncDialogOpen(true)}
                currentView={desktopState.currentView}></ButtonBar>
              <div className="main-panel">
                {
                  desktopState.currentView == EDesktopView.Database &&
                  <DatabaseView onSynchronizeSet={synchronizeSet} onCardSetDialog={(cardSet: CardSetViewmodel) => setCardSetDialogOpen(true, cardSet)}/>
                }
                {
                  desktopState.currentView == EDesktopView.Collection &&
                  <CollectionView />
                }
                {
                  desktopState.currentView == EDesktopView.Deck &&
                  <DeckView onSynchronizeCollection={synchronizeCollection} />
                }
              </div>
            </Card>
            <SettingsDialog isOpen={desktopState.settingsDialogOpen} onDialogClose={() => setSettingsDialogOpen(false)} />
            <SyncDialog isOpen={desktopState.syncDialogOpen} onDialogClose={() => setSyncDialogOpen(false)} onOkClick={startSync} />
            <SplashScreen isOpen={desktopState.splashScreenOpen} onDialogClose={() => setSplashScreenOpen(false)} />
            <CardSetDialog isOpen={desktopState.cardSetDialogOpen} onDialogClose={() => setCardSetDialogOpen(false)} cardSetId={desktopState.cardSet?.id} cardSetSvg={desktopState.cardSet?.cardSetSvg} />
          </CardSetContext.Provider>
        </CardSymbolContext.Provider>
      </LanguagesContext.Provider>
    </ConfigurationContext.Provider>
  );
  //#endregion
}
