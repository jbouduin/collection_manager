import "./App.css";

import { BlueprintProvider, FocusStyleManager } from "@blueprintjs/core";
import * as React from "react";
import { createRoot } from "react-dom/client";

import { DtoCardSet, DtoLanguage } from "../../common/dto";
import { QueryParam } from "../../common/ipc-params";
import { Desktop } from "./components/desktop/desktop";
import { DesktopProps } from "./components/desktop/desktop.props";
import { CardSetViewmodel } from "./viewmodels/card-set.viewmodel";

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
    cardSets: new Array<CardSetViewmodel>(),
    cachedSvg: new Map<string, string>(),
    languages: new Array<DtoLanguage>()
  };
  window.ipc.query(cardSymbolQueryParam)
    .then((cachedSvgs: Map<string, string>) => {
      desktopProps.cachedSvg = cachedSvgs;
    })
    .then(async () => await window.ipc.query({ type: "CardSet", options: null }))
    .then((cardSets: Array<DtoCardSet>) => desktopProps.cardSets = cardSets.map((cardSet: DtoCardSet) => new CardSetViewmodel(cardSet)))
    .then(async () => await window.ipc.query({ type: "Language", options: null }))
    .then((languages: Array<DtoLanguage>) => desktopProps.languages = languages)
    .then(() => root.render(
      <BlueprintProvider>
        <Desktop {...desktopProps} />
      </BlueprintProvider>
    ));
})();
