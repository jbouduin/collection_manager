import {
  Classes,
  IconName
} from "@blueprintjs/core";
import * as React from "react";
import { TemporaryMainPanel } from "./temporary-main-panel";

// import logo from "./logo.png";
const DARK_THEME = Classes.DARK;
const LIGHT_THEME = "";

export class Desktop extends React.PureComponent<any, any> {
  private _theme: string;
  private _themeIcon: IconName;

  private get theme(): string {
    return this._theme;
  }

  private set theme(value: string) {
    this._theme = value;
  }

  private get themeIcon(): IconName {
    return this._themeIcon;
  }

  private set themeIcon(themeIcon: IconName) {
    this._themeIcon = themeIcon;

  }
  // private setTheme(shouldUseDarkColors: boolean): void {
  //   this.theme = shouldUseDarkColors ? DARK_THEME : LIGHT_THEME;
  //   this.themeIcon = shouldUseDarkColors ? "flash" : "moon";
  // }

  public render() {
    return (
      <div className={this.theme}>
        <TemporaryMainPanel className={this.theme}></TemporaryMainPanel>
      </div>
    );
  }
}

/* <header> *
        <Navbar className={this.theme} fixedToTop={true}>
          <NavbarGroup align={Alignment.LEFT} className={this.theme}>
            <Icon icon="globe" />
            <NavbarDivider />
            <NavbarHeading>Magic assistant</NavbarHeading>
            <NavbarDivider />
            <AnchorButton text="MTG Database" minimal />
            <AnchorButton text="Collections" minimal />
            <AnchorButton text="Decks" minimal />
          </NavbarGroup>
          <Navbar.Group align={Alignment.RIGHT} className={this.theme}>
            <Button className="bp3-minimal" icon="notifications" />
            <Button className="bp3-minimal" icon={this.themeIcon} onClick={() => window.ipc.darkmode("toggle").then((value: boolean) => this.setTheme(value))} />
            <Button className="bp3-minimal" icon="cog" onClick={() => window.ipc.darkmode("toggle").then((value: boolean) => this.setTheme(value))} />
          </Navbar.Group>
        </Navbar>
         </header> */
