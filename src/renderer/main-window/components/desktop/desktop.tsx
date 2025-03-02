import { Card, Classes, Props } from "@blueprintjs/core";
import classNames from "classnames";
import { cloneDeep, noop } from "lodash";
import * as React from "react";
import { CardConditionDto, ConfigurationDto, LanguageDto, MtgCardSetDto } from "../../../../common/dto";
import { AfterSplashScreenClose } from "../../../common/collection-manager.props";
import { DisplayValueService, DisplayValueServiceContext, IpcProxyService, IpcProxyServiceContext } from "../../../common/context";
import { CardConditionViewmodel, CardSetViewmodel } from "../../viewmodels";
import { CardConditionContext, CardSetContext, CardSymbolContext, ConfigurationContext, LanguagesContext } from "../context";
import { ButtonBar } from "./button-bar/button-bar";
import { EDesktopView } from "./desktop-view.enum";
import { DesktopState } from "./desktop.state";
import { SplashScreen } from "./splash-screen/splash-screen";
import { CollectionView } from "./views/collection-view/collection-view";
import { DeckView } from "./views/deck-view/deck-view";
import { MtgView } from "./views/mtg-view/mtg-view";


export function Desktop(props: Props) {
  //#region State -------------------------------------------------------------
  const initialState: DesktopState = {
    initialized: false,
    cardConditions: new Array<CardConditionViewmodel>(),
    cardSets: new Array<CardSetViewmodel>(),
    currentView: EDesktopView.Database,
    languages: new Array<LanguageDto>(),
    rendererConfiguration: null,
    splashScreenOpen: false,
    symbolSvgs: new Map<string, string>()
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
          ]).then(
            ([cardSymbols, cardSets, languages, cardConditions]) => {
              newState.symbolSvgs = cardSymbols;
              newState.cardSets = cardSets
                .sort((a: MtgCardSetDto, b: MtgCardSetDto) => a.name.localeCompare(b.name))
                .map((cardSet: MtgCardSetDto) => new CardSetViewmodel(cardSet));
              newState.languages = languages;
              newState.cardConditions = cardConditions.map((condition: CardConditionDto) => new CardConditionViewmodel(condition));
              newState.initialized = true;
              setDesktopState(newState);
            },
            (_r: Error) => setDesktopState(initialState)
          );
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
  function afterSaveSettings(saved: ConfigurationDto): void {
    const newState = cloneDeep(desktopState);
    newState.rendererConfiguration = saved.rendererConfiguration;
    setDesktopState(newState);
  }
  //#endregion

  //#region Event handling -> Splashscreen -----------------------------------
  function hideSplashScreen(afterSplashScreenClose: Array<AfterSplashScreenClose>): void {
    if (afterSplashScreenClose != null) {
      const newState = cloneDeep(desktopState);
      newState.splashScreenOpen = false;
      const promises: Array<Promise<unknown>> = new Array<Promise<unknown>>();
      if (afterSplashScreenClose.includes("CardSymbols")) {
        promises.push(ipcProxyService
          .getData<Map<string, string>>("/card-symbol/svg")
          .then((r: Map<string, string>) => newState.symbolSvgs = r));
      }
      if (afterSplashScreenClose.includes("CardSets")) {
        promises.push(ipcProxyService
          .getData<Array<MtgCardSetDto>>("/card-set")
          .then((r: Array<MtgCardSetDto>) => newState.cardSets = r
            .sort((a: MtgCardSetDto, b: MtgCardSetDto) => a.name.localeCompare(b.name))
            .map((cardSet: MtgCardSetDto) => new CardSetViewmodel(cardSet))));
      }
      Promise.all(promises).then(
        () => setDesktopState(newState),
        noop
      );
    } else {
      const newState = cloneDeep(desktopState);
      newState.splashScreenOpen = false;
      setDesktopState(newState);
    }
  }

  function openSplashScreen() {
    const newState = cloneDeep(desktopState);
    newState.splashScreenOpen = true;
    setDesktopState(newState);
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
                        {...props}
                        afterSaveSettings={(saved: ConfigurationDto) => afterSaveSettings(saved)}
                        currentView={desktopState.currentView}
                        hideSplashScreen={(afterClose: Array<AfterSplashScreenClose>) => hideSplashScreen(afterClose)}
                        onDesktopViewSelectionClick={onDesktopViewSelectionClick}
                        showSplashScreen={() => openSplashScreen()}
                      />
                      <div className="main-panel">
                        {
                          desktopState.currentView == EDesktopView.Database &&
                          <MtgView
                            {...props}
                            hideSplashScreen={(afterClose: Array<AfterSplashScreenClose>) => hideSplashScreen(afterClose)}
                            showSplashScreen={() => openSplashScreen()}
                          />
                        }
                        {
                          desktopState.currentView == EDesktopView.Collection &&
                          <CollectionView {...props} />
                        }
                        {
                          desktopState.currentView == EDesktopView.Deck &&
                          <DeckView
                            {...props}
                            hideSplashScreen={(afterClose: Array<AfterSplashScreenClose>) => hideSplashScreen(afterClose)}
                            showSplashScreen={() => openSplashScreen()}
                          />
                        }
                      </div>
                    </Card>
                    {
                      desktopState.splashScreenOpen &&
                      <SplashScreen
                        {...props}
                        isOpen={desktopState.splashScreenOpen}
                        onDialogClose={noop}
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
