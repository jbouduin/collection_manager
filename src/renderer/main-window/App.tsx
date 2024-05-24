import "./App.css";

import * as React from "react";

import { BlueprintProvider, FocusStyleManager } from "@blueprintjs/core";
import { createRoot } from "react-dom/client";
import { Desktop } from "./components/desktop/desktop";
import { QueryParam } from "../../common/ipc-params";
import { DesktopProps } from "./components/desktop/desktop.props";
import { DtoCardSet, DtoLanguage } from "../../common/dto";

FocusStyleManager.onlyShowFocusOnTabs();

(async () => {
  // Wait until CSS is loaded before rendering components because some of them (like Table)
  // rely on those styles to take accurate DOM measurements.
  // TODO await import("./App.css");
  const container = document.getElementById("root") as HTMLElement;
  const root = createRoot(container);
  const cardSymbolQueryParam: QueryParam<null> = {
    type: "CardSymbolCachedSvg",
    options: null
  };
  const desktopProps: DesktopProps = {
    cardSets: new Array<DtoCardSet>(),
    cachedSvg: new Map<string, string>(),
    languages: new Array<DtoLanguage>()
  };
  window.ipc.query(cardSymbolQueryParam)
    .then((cachedSvgs: Map<string, string>) => {
      desktopProps.cachedSvg = cachedSvgs;
    })
    .then(async () => await window.ipc.query({ type: "CardSet", options: null }))
    .then((cardSets: Array<DtoCardSet>) => desktopProps.cardSets = cardSets)
    .then(async () => await window.ipc.query({ type: "Language", options: null }))
    .then((languages: Array<DtoLanguage>) => desktopProps.languages = languages)
    .then(() => root.render(
      <BlueprintProvider>
        <Desktop {...desktopProps} />
      </BlueprintProvider>
    ));
})();
