import * as React from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

import { CardSetViewmodel, CardViewmodel } from "../../../viewmodels";
import { CardView } from "../../common/card-view/card-view";
import { CardSetsTreeView } from "../../common/card-sets-tree-view/card-sets-tree-view";
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
    console.log("Card set selected in tree", sets.map((s: CardSetViewmodel) => s.cardSetName));
    setState({ selectedSets: sets, selectedCards: state.selectedCards });
  }

  function onCardSelected(cards?: Array<CardViewmodel>): void {
    console.log("Cards selected in table", cards.map((c: CardViewmodel) => c.cardName));
    setState({ selectedCards: cards, selectedSets: state.selectedSets });
  }
  //#endregion

  function calculateSetOfSelectedCard(): CardSetViewmodel {
    if (state.selectedCards) {
      const setOfSelectedCard = props.cardSets.filter((cardSet: CardSetViewmodel) => cardSet.id == state.selectedCards[0].setId);
      return setOfSelectedCard.length > 0 ? setOfSelectedCard[0] : null;
    }
    else {
      return null;
    }
  }
  //#region Main --------------------------------------------------------------
  return (
    <div>
      <PanelGroup direction="horizontal">
        <Panel defaultSize={20} className={props.className}>
          <CardSetsTreeView className={props.className} cardSets={props.cardSets} onSetsSelected={onCardSetsSelected} />
        </Panel>
        <PanelResizeHandle />
        <Panel>
          <CardsTableView className={props.className} symbolSvgs={props.symbolSvgs} selectedSets={state.selectedSets} languages={props.languages} onCardsSelected={onCardSelected}></CardsTableView>
        </Panel>
        <PanelResizeHandle />
        <Panel defaultSize={20}>
          <CardView
            className={props.className}
            selectedCard={state.selectedCards ? state.selectedCards[0] : null}
            cardSet={calculateSetOfSelectedCard()}
            symbolSvgs={props.symbolSvgs}
            languages={props.languages}
          />
          </Panel>
      </PanelGroup>
    </div >
  );
  //#endregion
}
