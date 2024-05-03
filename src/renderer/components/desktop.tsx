import { Button, Classes } from "@blueprintjs/core";
import * as React from "react";
import { ICardSetSyncOptions, ICardSyncOptions, ICatalogSyncOptions, ISyncParam } from "../../common/ipc-params";


const DARK_THEME = Classes.DARK;
const LIGHT_THEME = "";

export class Desktop extends React.PureComponent {

  private _theme: string;

  private get theme(): string {
    return this._theme;
  }

  private set theme(value: string) {
    this._theme = value;
  }

  private setTheme(shouldUseDarkColors: boolean): void {
    this.theme = shouldUseDarkColors ? DARK_THEME : LIGHT_THEME;
  }

  public render(): React.ReactNode {
    const chromeVersion = window.versions.chrome();
    const nodeVersion = window.versions.node();
    const elecVersion = window.versions.electron();

    const ping = "waiting for ping";
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
          <h3>Darkmode</h3>
          <Button text="Toggle" onClick={() => window.ipc.darkmode("toggle").then((value: boolean) => this.setTheme(value))} />
          <Button intent="success" text="System" onClick={() => window.ipc.darkmode("toggle").then((value: boolean) => this.setTheme(value))} />
        </p>
        <p>
          <h3>Sync</h3>
          <Button text="Sync some catalogs" onClick={() => {
            const param: ISyncParam<ICatalogSyncOptions> = {
              type: "Catalogs",
              options: { catalogs: ["AbilityWords", "ArtifactTypes"] }
            };
            window.ipc.sync(param);
          }} />
          <Button text="Sync cardsets" onClick={() => {
            const param: ISyncParam<ICardSetSyncOptions> = {
              type: "CardSets",
              options: { code: null }
            };
            window.ipc.sync(param);
          }} />
          <Button text="Sync card from MKM" onClick={() => {
            const param: ISyncParam<ICardSyncOptions> = {
              type: "Cards",
              options: { setCode: "MKM" }
            };
            window.ipc.sync(param);
          }} />
          <Button text="Sync card from SOI" onClick={() => {
            const param: ISyncParam<ICardSyncOptions> = {
              type: "Cards",
              options: { setCode: "SOI" }
            };
            window.ipc.sync(param);
          }} />
        </p>
        <p>
          <h3>Query</h3>
          <Button text="Query sets" onClick={() => window.ipc.query("CardSet")} />
          <Button text="Query artifact types" onClick={() => window.ipc.query("Catalog")} />
        </p>
      </div >
    );
  }
}
