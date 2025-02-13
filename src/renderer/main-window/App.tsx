import { BlueprintProvider, FocusStyleManager } from "@blueprintjs/core";
import * as React from "react";
import { createRoot } from "react-dom/client";
import { DtoCardSet, DtoConfiguration, DtoLanguage } from "../../common/dto";
import { QueryParam } from "../../common/ipc-params";
import { Desktop } from "./components/desktop/desktop";
import { DesktopProps } from "./components/desktop/desktop.props";
import { CardSetViewmodel } from "./viewmodels/card-set/card-set.viewmodel";

FocusStyleManager.onlyShowFocusOnTabs();

void (async () => {
  await import("./App.css");
  const container = document.getElementById("root");
  const root = createRoot(container);
  const cardSymbolQueryParam: QueryParam<null> = {
    type: "CardSymbolCachedSvg",
    options: null
  };
  const desktopProps: DesktopProps = {
    cardSets: new Array<CardSetViewmodel>(),
    symbolSvgs: new Map<string, string>(),
    languages: new Array<DtoLanguage>(),
    configuration: null
  };
  /* eslint-disable @typescript-eslint/no-unsafe-return */
  await window.ipc.query({ type: "Configuration", options: null })
    .then((configuration: DtoConfiguration) => desktopProps.configuration = configuration.rendererConfiguration)
    .then(async () => window.ipc.query(cardSymbolQueryParam))
    .then((cachedSvgs: Map<string, string>) => {
      desktopProps.symbolSvgs = cachedSvgs;
    })
    .then(async () => window.ipc.query({ type: "CardSet", options: null }))
    .then((cardSets: Array<DtoCardSet>) => desktopProps.cardSets = cardSets.map((cardSet: DtoCardSet) => new CardSetViewmodel(cardSet)))
    .then(async () => window.ipc.query({ type: "Language", options: null }))
    .then((languages: Array<DtoLanguage>) => desktopProps.languages = languages)
    /* eslint-disable @stylistic/function-paren-newline */
    .then(() => root.render(
      <BlueprintProvider>
        <Desktop {...desktopProps} />
      </BlueprintProvider>
    ));
})();
