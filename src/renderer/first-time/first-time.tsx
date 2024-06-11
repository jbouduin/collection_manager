import "../main-window/App.css";

import { BlueprintProvider, FocusStyleManager } from "@blueprintjs/core";
import * as React from "react";

import { createRoot } from "react-dom/client";
import { DtoConfiguration } from "../../common/dto/configuration/configuration.dto";
import { QueryParam } from "../../common/ipc-params";
import { ConfigurationViewModel } from "../common/viewmodels/configuration/configuration.viewmodel";
import { FirstTimeView } from "./first-time-view/first-time-view";


FocusStyleManager.onlyShowFocusOnTabs();

(async () => {
  // Wait until CSS is loaded before rendering components because some of them (like Table)
  // rely on those styles to take accurate DOM measurements.
  // TODO await import("./App.css");
  let configurationViewmodel: ConfigurationViewModel;
  const queryParam: QueryParam<null> = {
    type: "Configuration",
    options: null
  };
  window.ipc.query(queryParam)
    .then((configuration: DtoConfiguration) => configurationViewmodel = new ConfigurationViewModel( configuration, true))
    .then(() => {
      const container = document.getElementById("root") as HTMLElement;
      const root = createRoot(container);
      root.render(
        <BlueprintProvider>
          <FirstTimeView  configuration={configurationViewmodel} className={configurationViewmodel.theme} />
        </BlueprintProvider>
      );
    });
})();
