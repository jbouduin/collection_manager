import { ProgressBar } from "@blueprintjs/core";
import * as React from "react";
import { SplashContentState } from "./splash-content.state";

export function SplashContent() {
  //#region State -------------------------------------------------------------
  const initialState: SplashContentState = {
    label: "Loading",
    currentProgress: 1
  };
  const [state, setState] = React.useState(initialState);
  //#endregion

  //#region Main --------------------------------------------------------------
  window.ipc.onProgress((status) => {
    setState({ label: status });
  });

  return (
    <div className="splash-wrapper">
      <p>{state.label}</p>
      <ProgressBar animate={true} intent="primary" value={state.currentProgress} />
    </div>
  );
  //#endregion
}
