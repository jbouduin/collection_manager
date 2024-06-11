import * as React from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

import { CardSetViewmodel, CardViewmodel } from "../../../viewmodels";
import { CardSetsView } from "../../common/card-sets-view/card-sets-view";
import { CardView } from "../../common/card-view/card-view";
import { CardsTableView } from "../../common/cards-table-view/cards-table-view";
import { DatabaseViewProps } from "./database-view.props";
import { DatabaseViewState } from "./database-view.state";


export function DatabaseView(props: DatabaseViewProps) {
  console.log("in databaseview function");

  //#region State -------------------------------------------------------------
  const initialState: DatabaseViewState = {};
  const [state, setState] = React.useState(initialState);
  //#endregion

  //#region Event handlers ----------------------------------------------------
  function onCardSetsSelected(sets: Array<CardSetViewmodel>): void {
    setState({ selectedSets: sets, selectedCards: state.selectedCards });
  }

  function onCardSelected(cards?: Array<CardViewmodel>): void {
    setState({ selectedCards: cards, selectedSets: state.selectedSets });
  }
  //#endregion

  //#region Main --------------------------------------------------------------
  return (
    <>
      <PanelGroup direction="horizontal">
        <Panel defaultSize={20}>
          <CardSetsView
            onSetsSelected={onCardSetsSelected}
            onSynchronizeSet={props.onSynchronizeSet}
            onCardSetDialog={props.onCardSetDialog}/>
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
