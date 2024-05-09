import { Classes, IconName, Props } from "@blueprintjs/core";
import * as React from "react";

import { CollectionView } from "../collection/collection-view";
import { DatabaseView } from "../database/database-view";
import { DeckView } from "../deck/deck-view";
import { ButtonBar } from "./button-bar";
import { EDesktopView } from "./desktop-view.enum";
import { DesktopState } from "./desktop.state";

// import logo from "./logo.png";
const DARK_THEME = Classes.DARK;
const LIGHT_THEME = "";


export class Desktop extends React.PureComponent<Props, DesktopState> {
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

  private onButtonBarButtonClick(desktopView: EDesktopView): void {
    console.log("in desktop buttonbar button click event:", desktopView);
    this.setState({ currentView: desktopView });
  }

  public componentDidMount(): void {
    this.setState({ currentView: EDesktopView.Database });
  }

  public render(): React.JSX.Element {

    return (
      <div className="desktop-wrapper">
        <ButtonBar onSelectButton={this.onButtonBarButtonClick.bind(this)}></ButtonBar>
        <div className="main-panel">
          {(this.state == null || this.state.currentView == EDesktopView.Database) &&
            <DatabaseView className={this.theme} />
          }
          {this.state?.currentView == EDesktopView.Collection &&
            <CollectionView className={this.theme} />
          }
          {this.state?.currentView == EDesktopView.Deck &&
            <DeckView className={this.theme} />
          }
        </div>
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
