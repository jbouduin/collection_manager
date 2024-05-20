import * as React from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";


import { CardDto, CardSetDto } from "../../../../common/dto";
import { CardDetailPanel } from "../common/card-detail-panel/card-detail-panel";
import { CardSetsTree } from "../common/card-sets-tree/card-sets-tree";
import { CardsTable } from "../common/cards-table/cards-table";
import { DatabaseViewProps } from "./database-view.props";
import { DatabaseViewState } from "./database-view.state";


export function DatabaseView(props: DatabaseViewProps) {
  console.log("in databaseview function");

  //#region State -------------------------------------------------------------
  const initialState: DatabaseViewState = {};
  const [state, setState] = React.useState(initialState);
  //#endregion

  //#region Event handlers ----------------------------------------------------
  function onCardSetsSelected(sets: Array<CardSetDto>): void {
    console.log("Card set selected in tree", sets.map((s: CardSetDto) => s.cardSet.name));
    setState({ selectedSets: sets, selectedCards: state.selectedCards });
  }

  function onCardSelected(cards?: Array<CardDto>): void {
    // NOW console.log("Cards selected in table", cards.map((c: CardDto) => c.card.name));
    setState({ selectedCards: cards, selectedSets: state.selectedSets });
  }
  //#endregion

  function calculateSetOfSelectedCard(): CardSetDto {
    if (state.selectedCards) {
      const setOfSelectedCard = props.cardSets.filter((cardSet: CardSetDto) => cardSet.cardSet.id = state.selectedCards[0].card.set_id);
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
          <CardSetsTree className={props.className} cardSets={props.cardSets} onSetsSelected={onCardSetsSelected} />
        </Panel>
        <PanelResizeHandle />
        <Panel>
          <CardsTable className={props.className} cachedSvg={props.cachedSvg} selectedSets={state.selectedSets} languages={props.languages} onCardsSelected={onCardSelected}></CardsTable>
        </Panel>
        <PanelResizeHandle />
        <Panel defaultSize={20}>
          <CardDetailPanel className={props.className} card={state.selectedCards ? state.selectedCards[0] : null} cardSet={calculateSetOfSelectedCard()}/>
          </Panel>
      </PanelGroup>
    </div >
  );
  //#endregion
}
