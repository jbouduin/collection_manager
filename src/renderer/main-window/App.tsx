import "./App.css";

import * as React from "react";

import { BlueprintProvider, FocusStyleManager } from "@blueprintjs/core";
import { createRoot } from "react-dom/client";
import { Desktop } from "./components/desktop/desktop";
import { QueryParam } from "../../common/ipc-params";
import { DesktopProps } from "./components/desktop/desktop.props";
import { CardSetDto, LanguageDto } from "../../common/dto";

FocusStyleManager.onlyShowFocusOnTabs();

(async () => {
  // Wait until CSS is loaded before rendering components because some of them (like Table)
  // rely on those styles to take accurate DOM measurements.
  // TODO await import("./App.css");
  const container = document.getElementById("root") as HTMLElement;
  const root = createRoot(container);
  const symbologyQueryParam: QueryParam<null> = {
    type: "SymbologyCachedSvg",
    options: null
  };
  const desktopProps: DesktopProps = {
    cardSets: new Array<CardSetDto>(),
    cachedSvg: new Map<string, string>(),
    languages: new Array<LanguageDto>()
  };
  window.ipc.query(symbologyQueryParam)
    .then((cachedSvgs: Map<string, string>) => {
      desktopProps.cachedSvg = cachedSvgs;
    })
    .then(() => window.ipc.query({ type: "CardSet", options: null }))
    .then((cardSets: Array<CardSetDto>) => desktopProps.cardSets = cardSets)
    .then(() => window.ipc.query({ type: "Language", options: null }))
    .then((languages: Array<LanguageDto>) => desktopProps.languages = languages)
    .then(() => root.render(
      <BlueprintProvider>
        <Desktop {...desktopProps} />
      </BlueprintProvider>
    ));
})();
