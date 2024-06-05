import { Props } from "@blueprintjs/core";
import * as React from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

import { CardSetViewmodel, CardViewmodel } from "../../../viewmodels";
import { CardSetsView } from "../../common/card-sets-view/card-sets-view";
import { CardView } from "../../common/card-view/card-view";
import { CardsTableView } from "../../common/cards-table-view/cards-table-view";
import { DatabaseViewState } from "./database-view.state";


export function DatabaseView(_props: Props) {
  console.log("in databaseview function");

  //#region State -------------------------------------------------------------
  const initialState: DatabaseViewState = {};
  const [state, setState] = React.useState(initialState);
  //#endregion

  //#region Event handlers ----------------------------------------------------
  function onCardSetsSelected(sets: Array<CardSetViewmodel>): void {
    console.log("Card set selected in tree", sets.map((s: CardSetViewmodel) => s.cardSetName));
    setState({ selectedSets: sets, selectedCards: state.selectedCards });
  }

  function onCardSelected(cards?: Array<CardViewmodel>): void {
    console.log("Cards selected in table", cards.map((c: CardViewmodel) => c.cardName));
    setState({ selectedCards: cards, selectedSets: state.selectedSets });
  }
  //#endregion

  //#region Main --------------------------------------------------------------
  return (
    <>
      <PanelGroup direction="horizontal">
        <Panel defaultSize={20}>
          <CardSetsView onSetsSelected={onCardSetsSelected} />
        </Panel>
        <PanelResizeHandle />
        <Panel>
          <CardsTableView
            selectedSets={state.selectedSets}
            onCardsSelected={onCardSelected}
          />
        </Panel>
        <PanelResizeHandle />
        <Panel defaultSize={20}>
          <CardView
            cardId={state.selectedCards ? calculateCardToDisplay() : null}
          />
        </Panel>
      </PanelGroup>
    </>
  );
  //#endregion

  //#region Auxiliary methods -------------------------------------------------
  function calculateCardToDisplay(): string {
    return state.selectedCards[0].otherCardLanguages.at(0).id;
  }
  //#endregion
}
