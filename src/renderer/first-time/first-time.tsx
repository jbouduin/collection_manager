import { BlueprintProvider, FocusStyleManager, OverlayToaster, Position, ToastProps } from "@blueprintjs/core";
import * as React from "react";
import { createRoot } from "react-dom/client";
import { IConfigurationDto } from "../../common/dto";
import { IpcProxyService, IpcProxyServiceContext } from "../shared/context";
import { ConfigurationViewModel } from "../shared/viewmodels";
import { FirstTimeView } from "./first-time-view/first-time-view";


FocusStyleManager.onlyShowFocusOnTabs();

void (async () => {
  await import("../main-window/App.css");

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

  await ipcProxyService.getData<IConfigurationDto>("/configuration")
    .then(
      (configuration: IConfigurationDto) => new ConfigurationViewModel(configuration, true),
      (_r: Error) => undefined as IConfigurationDto
    )
    .then((configurationViewmodel: ConfigurationViewModel) => {
      const container = document.getElementById("root");
      const root = createRoot(container);
      if (configurationViewmodel) {
        const container = document.getElementById("root");
        const root = createRoot(container);
        /* eslint-disable @stylistic/function-paren-newline */
        root.render(
          <BlueprintProvider>
            <IpcProxyServiceContext.Provider value={ipcProxyService}>
              <FirstTimeView className={configurationViewmodel.theme} configuration={configurationViewmodel} />
            </IpcProxyServiceContext.Provider>
          </BlueprintProvider>
        );
      } else {
        root.render(
          <p>Unable to retrieve a default configuration.</p>
        );
      }
    });
})();
