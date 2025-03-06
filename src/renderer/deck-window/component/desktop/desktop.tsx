import { Card, Classes } from "@blueprintjs/core";
import classNames from "classnames";
import { cloneDeep, noop } from "lodash";
import * as React from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { CardConditionDto, ConfigurationDto, DeckDetailsDto, LanguageDto, MtgCardSetDto } from "../../../../common/dto";
import { CardConditionContext, CardSetContext, CardSymbolContext, ConfigurationContext, LanguagesContext } from "../../../main-window/components/context";
import { SplashScreen } from "../../../main-window/components/desktop/splash-screen/splash-screen";
import { AfterSplashScreenClose } from "../../../shared/collection-manager.props";
import { DisplayValueService, DisplayValueServiceContext, IpcProxyService, IpcProxyServiceContext } from "../../../shared/context";
import { DesktopProps } from "./desktop.props";
import { DesktopState } from "./desktop.state";
import { LeftPanel } from "./left-panel/left-panel";
import { RightPanel } from "./right-panel/right-panel";


export function Desktop(props: DesktopProps) {
  //#region State -------------------------------------------------------------
  const initialState: DesktopState = {
    initialized: false,
    cardConditions: new Array<CardConditionDto>(),
    cardSets: new Array<MtgCardSetDto>(),
    deck: null,
    languages: new Array<LanguageDto>(),
    rendererConfiguration: null,
    splashScreenOpen: false,
    symbolSvgs: new Map<string, string>(),
    themeClassName: ""
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
          newState.themeClassName = configuration.rendererConfiguration.useDarkTheme ? Classes.DARK : "";
          return newState;
        })
        .then((newState: DesktopState) => {
          void Promise.all([
            ipcProxyService.getData<Map<string, string>>("/card-symbol/svg"),
            ipcProxyService.getData<Array<MtgCardSetDto>>("/card-set"),
            ipcProxyService.getData<Array<LanguageDto>>("/language"),
            ipcProxyService.getData<Array<CardConditionDto>>("/card-condition"),
            ipcProxyService.getData<DeckDetailsDto>(`/deck/${props.deckId}`)
          ]).then(
            ([cardSymbols, cardSets, languages, cardConditions, deck]) => {
              newState.symbolSvgs = cardSymbols;
              newState.cardSets = cardSets.sort((a: MtgCardSetDto, b: MtgCardSetDto) => a.name.localeCompare(b.name));
              newState.languages = languages;
              newState.cardConditions = cardConditions;
              newState.deck = deck;
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
                    <Card className={classNames(desktopState.themeClassName, "desktop-wrapper")}>
                      <PanelGroup direction="horizontal">
                        <Panel defaultSize={80}>
                          <LeftPanel
                            {...props}
                            hideSplashScreen={hideSplashScreen}
                            showSplashScreen={openSplashScreen}
                          />
                        </Panel>
                        <PanelResizeHandle />
                        <Panel>
                          <RightPanel cardId={null} />
                        </Panel>
                      </PanelGroup>
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
