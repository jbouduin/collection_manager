import { Card, Classes } from "@blueprintjs/core";
import * as React from "react";

import { CollectionView } from "../views/collection-view/collection-view";
import { DatabaseView } from "../views/database-view/database-view";
import { DeckView } from "../views/deck-view/deck-view";
import { ButtonBar } from "./button-bar";
import { EDesktopView } from "./desktop-view.enum";
import { DesktopProps } from "./desktop.props";
import classNames from "classnames";
import { DARK_THEME, ThemeContext } from "../theme";

// import logo from "./logo.png";


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
    <ThemeContext.Provider value={DARK_THEME}>
      <Card className={classNames(theme, "desktop-wrapper")}>
        <ButtonBar onSelectButton={onButtonBarButtonClick}></ButtonBar>
        <div className="main-panel">
          {
            currentView == EDesktopView.Database &&
            <DatabaseView {...props} />
          }
          {
            currentView == EDesktopView.Collection &&
            <CollectionView />
          }
          {
            currentView == EDesktopView.Deck &&
            <DeckView />
          }
        </div>
      </Card>
    </ThemeContext.Provider>
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
