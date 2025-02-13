import { BlueprintProvider, FocusStyleManager } from "@blueprintjs/core";
import * as React from "react";
import { createRoot } from "react-dom/client";
import { DtoConfiguration } from "../../common/dto/configuration/configuration.dto";
import { QueryParam } from "../../common/ipc-params";
import { ConfigurationViewModel } from "../common/viewmodels/configuration/configuration.viewmodel";
import { FirstTimeView } from "./first-time-view/first-time-view";


FocusStyleManager.onlyShowFocusOnTabs();

void (async () => {
  await import("../main-window/App.css");
  let configurationViewmodel: ConfigurationViewModel;
  const queryParam: QueryParam<null> = {
    type: "Configuration",
    options: null
  };
  // Go to main to ask for the factory default
  await window.ipc.query(queryParam)
    .then((configuration: DtoConfiguration) => configurationViewmodel = new ConfigurationViewModel(configuration, true))
    .then(() => {
      const container = document.getElementById("root");
      const root = createRoot(container);
      /* eslint-disable @stylistic/function-paren-newline */
      root.render(
        <BlueprintProvider>
          <FirstTimeView className={configurationViewmodel.theme} configuration={configurationViewmodel} />
        </BlueprintProvider>
      );
    });
})();
