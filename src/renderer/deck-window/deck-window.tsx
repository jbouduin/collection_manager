import { FocusStyleManager, OverlaysProvider, OverlayToaster, PortalProvider, Position, ToastProps } from "@blueprintjs/core";
import * as React from "react";
import { createRoot } from "react-dom/client";
import * as url from "url";
import { IpcProxyService, IpcProxyServiceContext, ToastContext } from "../shared/context";
import { DeckWindowDesktop } from "./components/desktop/deck-window-desktop";

FocusStyleManager.onlyShowFocusOnTabs();

void (async () => {
  /*
   * Wait until CSS is loaded before rendering components because some of them (like Table)
   * rely on those styles to take accurate DOM measurements.
   */
  await import("./deck-window.css");
  const parsed = url.parse(document.URL, true);
  const deckId = Number.parseInt(parsed.query["id"] as string);
  const appToaster = await OverlayToaster.createAsync(
    {
      className: "recipe-toaster",
      position: Position.TOP
    },
    {
      domRenderer: (toaster, containerElement) => createRoot(containerElement).render(toaster)
    }
  );
  const toastCall = (props: ToastProps, key?: string) => appToaster.show(props, key);
  const ipcProxyService = new IpcProxyService(toastCall);

  const container = document.getElementById("root");
  const root = createRoot(container);
  /* eslint-disable @stylistic/function-paren-newline */
  root.render(
    <OverlaysProvider>
      <PortalProvider>
        <IpcProxyServiceContext.Provider value={ipcProxyService}>
          <ToastContext.Provider value={{ showToast: toastCall }} >
            <DeckWindowDesktop deckId={deckId} />
          </ToastContext.Provider>
        </IpcProxyServiceContext.Provider>
      </PortalProvider>
    </OverlaysProvider>
  );
})();
