import { FocusStyleManager, OverlaysProvider, OverlayToaster, PortalProvider, Position, ToastProps } from "@blueprintjs/core";
import * as React from "react";
import { createRoot } from "react-dom/client";
import { IpcProxyService, IpcProxyServiceContext } from "../shared/context";
import { Desktop } from "./components/desktop/desktop";


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
  const container = document.getElementById("root");
  const root = createRoot(container);
  /* eslint-disable @stylistic/function-paren-newline */
  root.render(
    <OverlaysProvider>
      <PortalProvider>
        <IpcProxyServiceContext.Provider value={ipcProxyService}>
          <Desktop />
        </IpcProxyServiceContext.Provider>
      </PortalProvider>
    </OverlaysProvider>
  );
})();
