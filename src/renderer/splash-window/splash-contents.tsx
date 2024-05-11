import { ProgressBar, Props } from "@blueprintjs/core";
import * as React from "react";
import { SplashContentState } from "./splash-content.state";

export class SplashContent extends React.PureComponent<Props, SplashContentState> {

  private currentValue = 1;

  public constructor(props: Props) {
    super(props);
    window.ipc.onProgress((status) => {
      console.log("splash", status);
      this.setState({ label: status });
    });
    this.state = { label: "Starting..." };
  }

  // public componentWillUnmount(): void {
  //   ipcRenderer.removeAllListeners("splash");
  // }

  public render(): React.ReactNode {
    return (
      <div className="splash-wrapper">
        <p>{this.state.label}</p>
        <ProgressBar animate={true} value={this.currentValue} intent="primary" ></ProgressBar>
      </div>
    );
  }
}
