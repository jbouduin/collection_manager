import { Button, Classes } from "@blueprintjs/core";
import * as React from "react";
import { EQueryType, EUpdateType } from "../../common";


const DARK_THEME = Classes.DARK;
const LIGHT_THEME = "";

export class Desktop extends React.PureComponent {

  private _theme: string;

  private get theme(): string {
    return this._theme;
  }

  private set theme(value: string) {
    this._theme = value;
    console.log("Theme", this._theme)

  }

  private setTheme(shouldUseDarkColors: boolean): void {
    this.theme = shouldUseDarkColors ? DARK_THEME : LIGHT_THEME
  }

  public render(): React.ReactNode {
    const chromeVersion = window.versions.chrome()
    const nodeVersion = window.versions.node()
    const elecVersion = window.versions.electron()

    const ping = "waiting for ping"
    return (
      <div className={this.theme}>
        <h2>💖 Hello from React - Blueprint desktop!</h2>
        <p>
          This app is using Chrome ({chromeVersion}), Node.js ({nodeVersion}), and Electron ({elecVersion})
        </p>
        <p>
          {ping}
        </p>
        <p>
          Theme: {this.theme}
        </p>
        <Button text="Toggle" onClick={() => window.ipc.toggle().then((value: boolean) => this.setTheme(value))} />
        <Button intent="success" text="System" onClick={() => window.ipc.system().then((value: boolean) => this.setTheme(value))} />
        <Button text="Query sets" onClick={() => window.ipc.query(EQueryType.Set)} />
        <Button text="Query cards" onClick={() => window.ipc.query(EQueryType.Card)} />
        <Button text="Update" onClick={() => window.ipc.update(EUpdateType.Sets)} />
      </div>
    );
  }
}
