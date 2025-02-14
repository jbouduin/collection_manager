import { BlueprintProvider, FocusStyleManager, OverlayToaster, Position, ToastProps } from "@blueprintjs/core";
import * as React from "react";
import { createRoot } from "react-dom/client";
import { CardSetDto, ConfigurationDto, LanguageDto } from "../../common/dto";
import { IpcProxyService, IpcProxyServiceContext } from "../common/context";
import { Desktop } from "./components/desktop/desktop";
import { DesktopProps } from "./components/desktop/desktop.props";
import { CardSetViewmodel } from "./viewmodels";


FocusStyleManager.onlyShowFocusOnTabs();

void (async () => {
  await import("./App.css");


  const appToaster = await OverlayToaster.createAsync(
    {
      className: "recipe-toaster",
      position: Position.TOP
    },
    {
      domRenderer: (toaster, containerElement) => createRoot(containerElement).render(toaster)
    }
  );

  const ipcProxyService = new IpcProxyService((props: ToastProps, key?: string) => appToaster.show(props, key));

  const desktopProps: DesktopProps = {
    cardSets: new Array<CardSetViewmodel>(),
    symbolSvgs: new Map<string, string>(),
    languages: new Array<LanguageDto>(),
    configuration: null
  };
  /* eslint-disable @typescript-eslint/no-unsafe-return */
  await ipcProxyService.getData<ConfigurationDto>("/configuration")
    .then((configuration: ConfigurationDto) => desktopProps.configuration = configuration.rendererConfiguration)
    .then(async () => ipcProxyService.getData<Map<string, string>>("/card-symbol/svg"))
    .then((cachedSvgs: Map<string, string>) => desktopProps.symbolSvgs = cachedSvgs)
    .then(async () => ipcProxyService.getData<Array<CardSetDto>>("/card-set"))
    .then((cardSets: Array<CardSetDto>) => desktopProps.cardSets = cardSets.map((cardSet: CardSetDto) => new CardSetViewmodel(cardSet)))
    .then(async () => ipcProxyService.getData<Array<LanguageDto>>("/language"))
    .then((languages: Array<LanguageDto>) => desktopProps.languages = languages)
    /* eslint-disable @stylistic/function-paren-newline */
    .then(() => {
      const container = document.getElementById("root");
      const root = createRoot(container);
      root.render(
        <BlueprintProvider>
          <IpcProxyServiceContext.Provider value={ipcProxyService}>
            <Desktop {...desktopProps} />
          </IpcProxyServiceContext.Provider>
        </BlueprintProvider>
      );
    });
})();
