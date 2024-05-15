import "./App.css";

import * as React from "react";

import { BlueprintProvider, FocusStyleManager } from "@blueprintjs/core";
import { createRoot } from "react-dom/client";
import { Desktop } from "./components/desktop/desktop";
import { IQueryOrSyncParam } from "../../common/ipc-params";
import { DesktopProps } from "./components/desktop/desktop.props";
import { CardSetSelectDto } from "../../common/dto";

FocusStyleManager.onlyShowFocusOnTabs();

(async () => {
  // Wait until CSS is loaded before rendering components because some of them (like Table)
  // rely on those styles to take accurate DOM measurements.
  // TODO await import("./App.css");
  const container = document.getElementById("root") as HTMLElement;
  const root = createRoot(container);
  const symbologyQueryParam: IQueryOrSyncParam<null> = {
    type: "SymbologyCachedSvg",
    options: null
  };
  const desktopProps: DesktopProps = {
    cardSets: new Array<CardSetSelectDto>(),
    cachedSvg: new Map<string, string>()
  };
  window.ipc.query(symbologyQueryParam)
    .then((cachedSvgs: Map<string, string>) => {
      desktopProps.cachedSvg = cachedSvgs;
    })
    .then(() => window.ipc.query({ type: "CardSet", options: null }))
    .then((cardSets: Array<CardSetSelectDto>) => desktopProps.cardSets = cardSets)
    .then(() => root.render(
      <BlueprintProvider>
        <Desktop {...desktopProps} />
      </BlueprintProvider>
    ));
})();
