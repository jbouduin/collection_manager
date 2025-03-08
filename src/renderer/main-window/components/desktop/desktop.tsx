import { Card, Classes, Props } from "@blueprintjs/core";
import classNames from "classnames";
import { cloneDeep, noop } from "lodash";
import * as React from "react";
import { CardConditionDto, ConfigurationDto, GameFormatDto, LanguageDto, MtgCardSetDto } from "../../../../common/dto";
import { AfterSplashScreenClose } from "../../../shared/collection-manager.props";
import * as Context from "../../../shared/context";
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
    cardConditions: new Array<CardConditionDto>(),
    cardSets: new Array<MtgCardSetDto>(),
    currentView: EDesktopView.Database,
    gameFormats: new Array<GameFormatDto>(),
    languages: new Array<LanguageDto>(),
    rendererConfiguration: null,
    splashScreenOpen: false,
    symbolSvgs: new Map<string, string>(),
    themeClassName: ""
  };
  const [desktopState, setDesktopState] = React.useState<DesktopState>(initialState);
  //#endregion

  //#region Context ---------------------------------------------------------------------
  const ipcProxyService = React.useContext<Context.IpcProxyService>(Context.IpcProxyServiceContext);
  //#endregion

  //#region Effects -----------------------------------------------------------
  React.useEffect(
    () => {
      void ipcProxyService.getData<ConfigurationDto>("/configuration")
        .then((configuration: ConfigurationDto) => {
          const newState = cloneDeep(initialState);
          newState.rendererConfiguration = configuration.rendererConfiguration;
          ipcProxyService.logServerResponses = configuration.rendererConfiguration.logServerResponses;
          newState.themeClassName = configuration.rendererConfiguration.useDarkTheme ? Classes.DARK : "";
          return newState;
        })
        .then((newState: DesktopState) => {
          void Promise.all([
            ipcProxyService.getData<Map<string, string>>("/card-symbol/svg"),
            ipcProxyService.getData<Array<MtgCardSetDto>>("/card-set"),
            ipcProxyService.getData<Array<LanguageDto>>("/language"),
            ipcProxyService.getData<Array<CardConditionDto>>("/card-condition"),
            ipcProxyService.getData<Array<GameFormatDto>>("/game-format/")
          ]).then(
            ([cardSymbols, cardSets, languages, cardConditions, gameFormats]) => {
              newState.symbolSvgs = cardSymbols;
              newState.cardSets = cardSets.sort((a: MtgCardSetDto, b: MtgCardSetDto) => a.name.localeCompare(b.name));
              newState.gameFormats = gameFormats;
              newState.languages = languages;
              newState.cardConditions = cardConditions;
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
    newState.themeClassName = saved.rendererConfiguration.useDarkTheme ? Classes.DARK : "";
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
          .then((r: Array<MtgCardSetDto>) => newState.cardSets = r.sort((a: MtgCardSetDto, b: MtgCardSetDto) => a.name.localeCompare(b.name))));
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
        <Context.ConfigurationContext.Provider value={desktopState.rendererConfiguration} >
          <Context.DisplayValueServiceContext.Provider value={new Context.DisplayValueService()}>
            <Context.LanguagesContext.Provider value={desktopState.languages}>
              <Context.CardSymbolContext.Provider value={desktopState.symbolSvgs}>
                <Context.CardSetContext.Provider value={desktopState.cardSets}>
                  <Context.CardConditionContext.Provider value={desktopState.cardConditions}>
                    <Context.GameFormatContext.Provider value={desktopState.gameFormats}>

                      <Card className={classNames(desktopState.themeClassName, "desktop-wrapper")}>
                        <ButtonBar
                          {...props}
                          afterSaveSettings={(saved: ConfigurationDto) => afterSaveSettings(saved)}
                          className={desktopState.themeClassName}
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
                              className={desktopState.themeClassName}
                              hideSplashScreen={(afterClose: Array<AfterSplashScreenClose>) => hideSplashScreen(afterClose)}
                              showSplashScreen={() => openSplashScreen()}
                            />
                          }
                          {
                            desktopState.currentView == EDesktopView.Collection &&
                            <CollectionView
                              {...props}
                              className={desktopState.themeClassName}
                            />
                          }
                          {
                            desktopState.currentView == EDesktopView.Deck &&
                            <DeckView
                              {...props}
                              className={desktopState.themeClassName}
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
                          className={desktopState.themeClassName}
                          isOpen={desktopState.splashScreenOpen}
                          onDialogClose={noop}
                        />
                      }
                    </Context.GameFormatContext.Provider>
                  </Context.CardConditionContext.Provider>
                </Context.CardSetContext.Provider>
              </Context.CardSymbolContext.Provider>
            </Context.LanguagesContext.Provider>
          </Context.DisplayValueServiceContext.Provider>
        </Context.ConfigurationContext.Provider >
      }
    </>
  );
  //#endregion
}
