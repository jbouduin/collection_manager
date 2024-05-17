import { Classes } from "@blueprintjs/core";
import * as React from "react";

import { CollectionView } from "../collection/collection-view";
import { DatabaseView } from "../database/database-view";
import { DeckView } from "../deck/deck-view";
import { ButtonBar } from "./button-bar";
import { EDesktopView } from "./desktop-view.enum";
import { DesktopProps } from "./desktop.props";

// import logo from "./logo.png";
const DARK_THEME = Classes.DARK;
const LIGHT_THEME = "";

export function Desktop(props: DesktopProps) {
  console.log("in desktop function");
  //#region State -------------------------------------------------------------
  const [theme, setTheme] = React.useState(DARK_THEME);
  const [currentView, setCurrentView] = React.useState(EDesktopView.Database);
  //#endregion

  //#region Event handling ----------------------------------------------------
  function onButtonBarButtonClick(desktopView: EDesktopView): void {
    console.log("in desktop buttonbar button click event:", desktopView);
    setCurrentView(desktopView);
  }
  //#endregion

  //#region Main --------------------------------------------------------------
  return (
    <div className="desktop-wrapper">
      <ButtonBar className={theme} onSelectButton={onButtonBarButtonClick}></ButtonBar>
      <div className="main-panel">
        {(currentView == EDesktopView.Database) &&
          <DatabaseView {...props} className={theme} />
        }
        {currentView == EDesktopView.Collection &&
          <CollectionView className={theme} />
        }
        {currentView == EDesktopView.Deck &&
          <DeckView className={theme} />
        }
      </div>
    </div>
  );
  //#endregion
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
