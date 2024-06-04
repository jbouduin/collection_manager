import { Card } from "@blueprintjs/core";
import * as React from "react";

import classNames from "classnames";
import { CardSymbolContext, DARK_THEME, LanguagesContext, ThemeContext } from "../context";
import { CollectionView } from "../views/collection-view/collection-view";
import { DatabaseView } from "../views/database-view/database-view";
import { DeckView } from "../views/deck-view/deck-view";
import { ButtonBar } from "./button-bar";
import { EDesktopView } from "./desktop-view.enum";
import { DesktopProps } from "./desktop.props";

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
      <LanguagesContext.Provider value={props.languages}>
        <CardSymbolContext.Provider value={props.symbolSvgs}>
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
        </CardSymbolContext.Provider>
      </LanguagesContext.Provider>
    </ThemeContext.Provider>
  );
  //#endregion
}
