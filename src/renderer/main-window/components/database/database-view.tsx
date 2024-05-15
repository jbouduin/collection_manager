import { Card } from "@blueprintjs/core";
import * as React from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";


import { CardSetsTree } from "../common/card-sets-tree/card-sets-tree";
import { CardsTable } from "../common/cards-table/cards-table";
import { DatabaseViewState } from "./database-view.state";
import { DatabaseViewProps } from "./database-view.props";


export function DatabaseView(props: DatabaseViewProps) {
  console.log("in databaseview function");

  //#region State -------------------------------------------------------------
  const [state, setState] = React.useState({} as DatabaseViewState);
  //#endregion

  //#region Event handlers ----------------------------------------------------
  function onCardSetsSelected(setIds: Array<string>): void {
    console.log("nmessage from database view Card set selected in tree", setIds);
    setState({ selectedSetIds: setIds });
  }

  function onCardSelected(cardId ?: string): void {
    console.log("Card selected in table", cardId);
    setState({ selectedCardIds: [cardId] });
  }
  //#endregion

  //#region Main --------------------------------------------------------------
  return (
    <div>
      <PanelGroup direction="horizontal">
        <Panel defaultSize={20}>
          <CardSetsTree {...props} onSetsSelected={onCardSetsSelected} />
        </Panel>
        <PanelResizeHandle />
        <Panel>
          <CardsTable {...props} selectedSetIds={state.selectedSetIds} onCardSelected={onCardSelected}></CardsTable>
        </Panel>
        <PanelResizeHandle />
        <Panel defaultSize={20}>
          <PanelGroup direction="vertical">
            <Panel>
              <Card>Here comes the image</Card>
            </Panel>
            <PanelResizeHandle />
            <Panel><Card>Here comes the info</Card></Panel>
          </PanelGroup>
        </Panel>
      </PanelGroup>
    </div >
  );
  //#endregion
}
