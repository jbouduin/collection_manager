import { Button, Classes } from "@blueprintjs/core";
import * as React from "react";

import { CardSetSyncOptions, CardSyncOptions, CatalogSyncOptions, IQueryOrSyncParam } from "../../common/ipc-params";


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
            const param: IQueryOrSyncParam<CatalogSyncOptions> = {
              type: "Catalog",
              options: { catalogs: ["AbilityWords", "ArtifactTypes", "LandTypes"] }
            };
            window.ipc.sync(param);
          }} />
          <Button text="Sync symbology" onClick={() => {
            const param: IQueryOrSyncParam<undefined> = {
              type: "Symbology",
              options: undefined
            };
            window.ipc.sync(param);
          }} />
          <Button text="Sync cardsets" onClick={() => {
            const param: IQueryOrSyncParam<CardSetSyncOptions> = {
              type: "CardSet",
              options: { code: null }
            };
            window.ipc.sync(param);
          }} />
          <Button text="Sync card from MKM" onClick={() => {
            const param: IQueryOrSyncParam<CardSyncOptions> = {
              type: "Card",
              options: { setCode: "MKM" }
            };
            window.ipc.sync(param);
          }} />
          <Button text="Sync card from SOI" onClick={() => {
            const param: IQueryOrSyncParam<CardSyncOptions> = {
              type: "Card",
              options: { setCode: "SOI" }
            };
            window.ipc.sync(param);
          }} />
        </p>
        <p>
          <h3>Query</h3>
          <Button text="Query Artifact types" onClick={() => window.ipc.query({ type: "Catalog", options: null })} />
          <Button text="Query Sets" onClick={() => window.ipc.query({ type: "CardSet", options: null })} />
          <Button text="Query Language" onClick={() => window.ipc.query({ type: "Language", options: null })} />
          <Button text="Query Colors" onClick={() => window.ipc.query({ type: "Color", options: null })} />
          <Button text="Query Symbology" onClick={() => window.ipc.query({ type: "Symbology", options: null })} />
          <Button text="Query or Sync ruling" onClick={() => window.ipc.queryOrSync({ type: "Ruling", options: { cardId: "bd6e71a1-713e-4eca-bd65-9f0638c16794"} }).then((result) => console.log(result))} />
        </p>
      </div >
    );
  }
}
