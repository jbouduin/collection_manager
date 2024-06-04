import { Card, Classes } from "@blueprintjs/core";
import * as React from "react";
import classNames from "classnames";

import { CardSetContext, CardSymbolContext, LanguagesContext, ThemeContext } from "../context";
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
    <ThemeContext.Provider value={Classes.DARK}>
      <LanguagesContext.Provider value={props.languages}>
        <CardSymbolContext.Provider value={props.symbolSvgs}>
          <CardSetContext.Provider value={props.cardSets}>
            <Card className={classNames(Classes.DARK, "desktop-wrapper")}>
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
          </CardSetContext.Provider>
        </CardSymbolContext.Provider>
      </LanguagesContext.Provider>
    </ThemeContext.Provider>
  );
  //#endregion
}
