import { Card, Classes } from "@blueprintjs/core";
import classNames from "classnames";
import { clone } from "lodash";
import * as React from "react";
import { SyncParamDto } from "../../../../common/dto";
import { CardSetViewmodel } from "../../viewmodels";
import { CardSetContext, CardSymbolContext, ConfigurationContext, LanguagesContext } from "../context";
import { ButtonBar } from "./button-bar/button-bar";
import { CardSetDialog } from "./card-set-dialog/card-set-dialog";
import { EDesktopView } from "./desktop-view.enum";
import { DesktopProps } from "./desktop.props";
import { DesktopState } from "./desktop.state";
import { SettingsDialog } from "./settings-dialog/settings-dialog";
import { SplashScreen } from "./splash-screen/splash-screen";
import { SyncDialog } from "./sync-dialog/sync-dialog";
import { CollectionView } from "./views/collection-view/collection-view";
import { DatabaseView } from "./views/database-view/database-view";
import { DeckView } from "./views/deck-view/deck-view";
import { DisplayValueService, DisplayValueServiceContext } from "../../../common/context";

export function Desktop(props: DesktopProps) {
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

    const params: SyncParamDto = {
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
    void window.ipc.sync(params);
  }

  function synchronizeCollection(ids: Array<string>): void {
    const newState = clone(desktopState);
    newState.splashScreenOpen = true;
    setDesktopState(newState);

    const params: SyncParamDto = {
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
    void window.ipc.sync(params);
  }

  function startSync(syncParam: SyncParamDto): void {
    setSplashScreenOpen(true);
    void window.ipc.sync(syncParam);
  }
  //#endregion

  //#region Main --------------------------------------------------------------
  return (
    <ConfigurationContext.Provider value={props.configuration}>
      <DisplayValueServiceContext.Provider value={new DisplayValueService()}>
        <LanguagesContext.Provider value={props.languages}>
          <CardSymbolContext.Provider value={props.symbolSvgs}>
            <CardSetContext.Provider value={props.cardSets}>
              <Card className={classNames(props.configuration.useDarkTheme ? Classes.DARK : "", "desktop-wrapper")}>
                <ButtonBar
                  currentView={desktopState.currentView}
                  onDesktopViewSelectionClick={onDesktopViewSelectionClick}
                  onSettingsMenuClick={() => setSettingsDialogOpen(true)}
                  onSyncMenuClick={() => setSyncDialogOpen(true)}
                />
                <div className="main-panel">
                  {
                    desktopState.currentView == EDesktopView.Database &&
                    <DatabaseView onCardSetDialog={(cardSet: CardSetViewmodel) => setCardSetDialogOpen(true, cardSet)} onSynchronizeSet={synchronizeSet} />
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
              <SettingsDialog
                isOpen={desktopState.settingsDialogOpen}
                onDialogClose={() => setSettingsDialogOpen(false)}
              />
              <SyncDialog
                isOpen={desktopState.syncDialogOpen}
                onDialogClose={() => setSyncDialogOpen(false)}
                onOkClick={startSync}
              />
              <SplashScreen
                isOpen={desktopState.splashScreenOpen}
                onDialogClose={() => setSplashScreenOpen(false)}
              />
              <CardSetDialog
                cardSetId={desktopState.cardSet?.id}
                cardSetSvg={desktopState.cardSet?.cardSetSvg}
                isOpen={desktopState.cardSetDialogOpen}
                onDialogClose={() => setCardSetDialogOpen(false)}
              />
            </CardSetContext.Provider>
          </CardSymbolContext.Provider>
        </LanguagesContext.Provider>
      </DisplayValueServiceContext.Provider>
    </ConfigurationContext.Provider>
  );
  //#endregion
}
