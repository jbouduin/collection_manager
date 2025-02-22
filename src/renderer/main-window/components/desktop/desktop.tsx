import { Card, Classes, Props } from "@blueprintjs/core";
import classNames from "classnames";
import { cloneDeep } from "lodash";
import * as React from "react";
import { CardConditionDto, ConfigurationDto, LanguageDto, MtgCardSetDto, SyncParamDto } from "../../../../common/dto";
import { DisplayValueService, DisplayValueServiceContext, IpcProxyService, IpcProxyServiceContext } from "../../../common/context";
import { CardConditionViewmodel, CardSetViewmodel } from "../../viewmodels";
import { CardConditionContext, CardSetContext, CardSymbolContext, ConfigurationContext, LanguagesContext } from "../context";
import { ButtonBar } from "./button-bar/button-bar";
import { EDesktopView } from "./desktop-view.enum";
import { AfterSplashScreenClose, DesktopState } from "./desktop.state";
import { SettingsDialog } from "./settings-dialog/settings-dialog";
import { SplashScreen } from "./splash-screen/splash-screen";
import { SyncDialog } from "./sync-dialog/sync-dialog";
import { CollectionView } from "./views/collection-view/collection-view";
import { DeckView } from "./views/deck-view/deck-view";
import { MtgView } from "./views/mtg-view/mtg-view";

export function Desktop(_props: Props) {
  //#region State -------------------------------------------------------------
  const initialState: DesktopState = {
    afterSplashScreenClose: null,
    initialized: false,
    currentView: EDesktopView.Database,
    settingsDialogOpen: false,
    syncDialogOpen: false,
    splashScreenOpen: false,
    cardSetDialogOpen: false,
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

  //#region Event handling -> view selection ----------------------------------
  function onDesktopViewSelectionClick(desktopView: EDesktopView): void {
    const newState = cloneDeep(desktopState);
    newState.currentView = desktopView;
    setDesktopState(newState);
  }
  //#endregion

  //#region Event handling -> Settings Dialog ---------------------------------
  function setSettingsDialogOpen(open: boolean): void {
    const newState = cloneDeep(desktopState);
    newState.settingsDialogOpen = open;
    setDesktopState(newState);
  }

  function afterSaveSettings(saved: ConfigurationDto): void {
    const newState = cloneDeep(desktopState);
    newState.settingsDialogOpen = false;
    newState.rendererConfiguration = saved.rendererConfiguration;
    setDesktopState(newState);
  }
  //#endregion

  //#region Event handling -> Sync Dialog -------------------------------------
  function setSyncDialogOpen(open: boolean): void {
    const newState = cloneDeep(desktopState);
    newState.syncDialogOpen = open;
    setDesktopState(newState);
  }
  //#endregion

  //#region Event handling -> Splashscreen -----------------------------------
  async function closeSplashScreen(): Promise<void> {
    if (desktopState.afterSplashScreenClose != null) {
      const newState = cloneDeep(desktopState);
      newState.splashScreenOpen = false;
      newState.afterSplashScreenClose = null;
      if (desktopState.afterSplashScreenClose.includes("CardSymbols")) {
        newState.symbolSvgs = await ipcProxyService.getData<Map<string, string>>("/card-symbol/svg");
      }
      if (desktopState.afterSplashScreenClose.includes("CardSets")) {
        newState.cardSets = await ipcProxyService
          .getData<Array<MtgCardSetDto>>("/card-set")
          .then((r: Array<MtgCardSetDto>) => r.map((cardSet: MtgCardSetDto) => new CardSetViewmodel(cardSet)));
      }
      setDesktopState(newState);
    } else {
      const newState = cloneDeep(desktopState);
      newState.splashScreenOpen = false;
      setDesktopState(newState);
    }
  }
  //#endregion

  //#region Event handling -> Card set ----------------------------------------
  function synchronizeSet(code: string): void {
    const newState = cloneDeep(desktopState);
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
    const newState = cloneDeep(desktopState);
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
    const newState = cloneDeep(desktopState);
    newState.syncDialogOpen = false;
    newState.splashScreenOpen = true;
    if (syncParam.syncCardSets || syncParam.syncCardSymbols) {
      newState.afterSplashScreenClose = new Array<AfterSplashScreenClose>();
      if (syncParam.syncCardSets) {
        newState.afterSplashScreenClose.push("CardSets");
      }
      if (syncParam.syncCardSymbols) {
        newState.afterSplashScreenClose.push("CardSymbols");
      }
    }
    setDesktopState(newState);
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
                          <MtgView onSynchronizeSet={synchronizeSet} />
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
                    {
                      desktopState.settingsDialogOpen &&
                      <SettingsDialog
                        afterSave={(saved: ConfigurationDto) => afterSaveSettings(saved)}
                        isOpen={desktopState.settingsDialogOpen}
                        onDialogClose={() => setSettingsDialogOpen(false)}
                      />
                    }
                    {
                      desktopState.syncDialogOpen &&
                      <SyncDialog
                        isOpen={desktopState.syncDialogOpen}
                        onDialogClose={() => setSyncDialogOpen(false)}
                        onOkClick={startSync}
                      />
                    }
                    {
                      desktopState.splashScreenOpen &&
                      <SplashScreen
                        isOpen={desktopState.splashScreenOpen}
                        onDialogClose={() => void closeSplashScreen()}
                      />
                    }
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
