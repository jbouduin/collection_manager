import { Card, Classes } from "@blueprintjs/core";
import classNames from "classnames";
import { cloneDeep, noop } from "lodash";
import * as React from "react";
import { ICardConditionDto, IConfigurationDto, IGameFormatDto, ILanguageDto, IMtgCardSetDto } from "../../../../../common/dto";
import * as Context from "../../../../shared/context";
import { AfterSplashScreenClose } from "../collection-manager.props";
import { BaseDesktopProps } from "./base-desktop.props";
import { BaseDesktopState } from "./base-desktop.state";
import { SplashScreen } from "../../splash/splash-screen";


export function BaseDesktop(props: BaseDesktopProps) {
  //#region State -------------------------------------------------------------
  const initialState: BaseDesktopState = {
    initialized: false,
    cardConditions: new Array<ICardConditionDto>(),
    cardSets: new Array<IMtgCardSetDto>(),
    gameFormats: new Array<IGameFormatDto>(),
    languages: new Array<ILanguageDto>(),
    rendererConfiguration: null,
    splashScreenOpen: false,
    symbolSvgs: new Map<string, string>(),
    themeClassName: ""
  };
  const [desktopState, setDesktopState] = React.useState<BaseDesktopState>(initialState);
  //#endregion

  //#region Context ---------------------------------------------------------------------
  const ipcProxyService = React.useContext<Context.IpcProxyService>(Context.IpcProxyServiceContext);
  //#endregion

  //#region Effects -----------------------------------------------------------
  React.useEffect(
    () => {
      void ipcProxyService.getData<IConfigurationDto>("/configuration")
        .then((configuration: IConfigurationDto) => {
          const newState = cloneDeep(initialState);
          newState.rendererConfiguration = configuration.rendererConfiguration;
          ipcProxyService.logServerResponses = configuration.rendererConfiguration.logServerResponses;
          newState.themeClassName = configuration.rendererConfiguration.useDarkTheme ? Classes.DARK : "";
          return newState;
        })
        .then((newState: BaseDesktopState) => {
          void Promise.all([
            ipcProxyService.getData<Map<string, string>>("/card-symbol/svg"),
            ipcProxyService.getData<Array<IMtgCardSetDto>>("/card-set"),
            ipcProxyService.getData<Array<ILanguageDto>>("/language"),
            ipcProxyService.getData<Array<ICardConditionDto>>("/card-condition"),
            ipcProxyService.getData<Array<IGameFormatDto>>("/game-format/")
          ]).then(
            ([cardSymbols, cardSets, languages, cardConditions, gameFormats]) => {
              newState.symbolSvgs = cardSymbols;
              newState.cardSets = cardSets.sort((a: IMtgCardSetDto, b: IMtgCardSetDto) => a.name.localeCompare(b.name));
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
          .getData<Array<IMtgCardSetDto>>("/card-set")
          .then((r: Array<IMtgCardSetDto>) => newState.cardSets = r.sort((a: IMtgCardSetDto, b: IMtgCardSetDto) => a.name.localeCompare(b.name))));
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

  function onConfigurationChanged(saved: IConfigurationDto): void {
    const newState = cloneDeep(desktopState);
    newState.rendererConfiguration = saved.rendererConfiguration;
    newState.themeClassName = saved.rendererConfiguration.useDarkTheme ? Classes.DARK : "";
    setDesktopState(newState);
  }

  //#region Rendering -------------------------------------------------------
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
                        {props.desktopContent({
                          className: desktopState.themeClassName,
                          hideSplashScreen: (afterClose: Array<AfterSplashScreenClose>) => hideSplashScreen(afterClose),
                          onConfigurationChanged: (newConfiguration: IConfigurationDto) => onConfigurationChanged(newConfiguration),
                          showSplashScreen: () => openSplashScreen()
                        })}
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
