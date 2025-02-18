import { BlueprintProvider, FocusStyleManager, OverlayToaster, Position, ToastProps } from "@blueprintjs/core";
import * as React from "react";
import { createRoot } from "react-dom/client";
import { MtgCardSetDto, ConfigurationDto, LanguageDto } from "../../common/dto";
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
    .then((configuration: ConfigurationDto) => {
      desktopProps.configuration = configuration.rendererConfiguration;
      ipcProxyService.logServerResponses = configuration.rendererConfiguration.logServerResponses;
    })
    .then(async () => ipcProxyService.getData<Map<string, string>>("/card-symbol/svg"))
    .then((cachedSvgs: Map<string, string>) => desktopProps.symbolSvgs = cachedSvgs)
    .then(async () => ipcProxyService.getData<Array<MtgCardSetDto>>("/card-set"))
    .then((cardSets: Array<MtgCardSetDto>) => desktopProps.cardSets = cardSets.map((cardSet: MtgCardSetDto) => new CardSetViewmodel(cardSet)))
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
