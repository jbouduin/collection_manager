import "./splash-window.css";

import * as React from "react";

import { BlueprintProvider, FocusStyleManager } from "@blueprintjs/core";
import { createRoot } from "react-dom/client";
import { SplashContent } from "../common/components/splash/splash-contents";
// import { Desktop } from "./components/desktop/desktop";

FocusStyleManager.onlyShowFocusOnTabs();

(async () => {
  // Wait until CSS is loaded before rendering components because some of them (like Table)
  // rely on those styles to take accurate DOM measurements.
  // TODO await import("./App.css");
  const container = document.getElementById("root") as HTMLElement;
  const root = createRoot(container);
  root.render(
    <BlueprintProvider>
      <SplashContent />
    </BlueprintProvider>
  );
})();
