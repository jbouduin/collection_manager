import { Card, Classes, Props } from "@blueprintjs/core";
import classNames from "classnames";
import { clone, cloneDeep } from "lodash";
import * as React from "react";
import { CardConditionDto, ConfigurationDto, LanguageDto, MtgCardSetDto, SyncParamDto } from "../../../../common/dto";
import { CardConditionViewmodel, CardSetViewmodel } from "../../viewmodels";
import { CardConditionContext, CardSetContext, CardSymbolContext, ConfigurationContext, LanguagesContext } from "../context";
import { ButtonBar } from "./button-bar/button-bar";
import { CardSetDialog } from "./card-set-dialog/card-set-dialog";
import { EDesktopView } from "./desktop-view.enum";
import { DesktopState } from "./desktop.state";
import { SettingsDialog } from "./settings-dialog/settings-dialog";
import { SplashScreen } from "./splash-screen/splash-screen";
import { SyncDialog } from "./sync-dialog/sync-dialog";
import { CollectionView } from "./views/collection-view/collection-view";
import { DatabaseView } from "./views/database-view/database-view";
import { DeckView } from "./views/deck-view/deck-view";
import { DisplayValueService, DisplayValueServiceContext, IpcProxyService, IpcProxyServiceContext } from "../../../common/context";

export function Desktop(_props: Props) {
  //#region State -------------------------------------------------------------
  const initialState: DesktopState = {
    initialized: false,
    currentView: EDesktopView.Database,
    settingsDialogOpen: false,
    syncDialogOpen: false,
    splashScreenOpen: false,
    cardSetDialogOpen: false,
    cardSet: null,
    rendererConfiguration: null,
    cardConditions: new Array<CardConditionViewmodel>(),
    cardSets: new Array<CardSetViewmodel>(),
    symbolSvgs: new Map<string, string>(),
    languages: new Array<LanguageDto>()
  };
  const [desktopState, setDesktopState] = React.useState<DesktopState>(initialState);
  //#endregion

  //#region Context ---------------------------------------------------------------------
  const ipcProxyService = React.useContext<IpcProxyService>(IpcProxyServiceContext);
  //#endregion

  //#region Effects -----------------------------------------------------------
  React.useEffect(
    () => {
      void ipcProxyService.getData<ConfigurationDto>("/configuration")
        .then((configuration: ConfigurationDto) => {
          const newState = cloneDeep(initialState);
          newState.rendererConfiguration = configuration.rendererConfiguration;
          ipcProxyService.logServerResponses = configuration.rendererConfiguration.logServerResponses;
          return newState;
        })
        .then((newState: DesktopState) => {
          void Promise.all([
            ipcProxyService.getData<Map<string, string>>("/card-symbol/svg"),
            ipcProxyService.getData<Array<MtgCardSetDto>>("/card-set"),
            ipcProxyService.getData<Array<LanguageDto>>("/language"),
            ipcProxyService.getData<Array<CardConditionDto>>("/card-condition")
          ]).then(([cardSymbols, cardSets, languages, cardConditions]) => {
            newState.symbolSvgs = cardSymbols;
            newState.cardSets = cardSets.map((cardSet: MtgCardSetDto) => new CardSetViewmodel(cardSet));
            newState.languages = languages;
            newState.cardConditions = cardConditions.map((condition: CardConditionDto) => new CardConditionViewmodel(condition));
            newState.initialized = true;
            setDesktopState(newState);
          });
        });
    },
    []
  );
  //#endregion

  //#region Event handling ----------------------------------------------------
  function onDesktopViewSelectionClick(desktopView: EDesktopView): void {
    const newState = clone(desktopState);
    newState.currentView = desktopView;
    setDesktopState(newState);
  }

  function setSettingsDialogOpen(open: boolean): void {
    // NOW here we have to retrieve settings again
    const newState = clone(desktopState);
    newState.settingsDialogOpen = open;
    setDesktopState(newState);
  }

  function setSyncDialogOpen(open: boolean): void {
    // NOW here we have to retrieve cardsets and card symbols
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
    void ipcProxyService.postData<SyncParamDto, never>("/mtg-sync", params);
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
    void ipcProxyService.postData<SyncParamDto, never>("/mtg-sync", params);
  }

  function startSync(syncParam: SyncParamDto): void {
    setSplashScreenOpen(true);
    void ipcProxyService.postData<SyncParamDto, never>("/mtg-sync", syncParam);
  }
  //#endregion

  //#region Main --------------------------------------------------------------
  return (
    <>
      {
        desktopState.initialized &&
        <ConfigurationContext.Provider value={desktopState.rendererConfiguration} >
          <DisplayValueServiceContext.Provider value={new DisplayValueService()}>
            <LanguagesContext.Provider value={desktopState.languages}>
              <CardSymbolContext.Provider value={desktopState.symbolSvgs}>
                <CardSetContext.Provider value={desktopState.cardSets}>
                  <CardConditionContext.Provider value={desktopState.cardConditions}>
                    <Card className={classNames(desktopState.rendererConfiguration.useDarkTheme ? Classes.DARK : "", "desktop-wrapper")}>
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
                  </CardConditionContext.Provider>
                </CardSetContext.Provider>
              </CardSymbolContext.Provider>
            </LanguagesContext.Provider>
          </DisplayValueServiceContext.Provider>
        </ConfigurationContext.Provider >
      }
    </>
  );
  //#endregion
}
