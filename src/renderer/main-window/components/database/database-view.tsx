import { Card, Props, TreeNodeInfo } from "@blueprintjs/core";
import * as React from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

import { CardSetSelectDto } from "../../../../common/dto";
import { CardSetsTree } from "../common/card-sets-tree/card-sets-tree";
import { CardsTable } from "../common/cards-table/cards-table";
import { DatabaseViewState } from "./database-view.state";
import { DatabaseViewProps } from "./database-view.props";


export class DatabaseView extends React.Component<Props, DatabaseViewState> {

  //#region Private readonly properties ---------------------------------------
  //#endregion

  //#region Constructor & C° --------------------------------------------------
  public constructor(props: Props) {
    super(props);
    this.state = {
      nodes: new Array<TreeNodeInfo<CardSetSelectDto>>(),
      currentSelectedPath: null,
      currentSelectedSets: null
    };

  }
  //#endregion

  //#region React methods -----------------------------------------------------
  public render(): React.ReactNode {
    // LATER Move to about dialog
    // const chromeVersion = window.versions.chrome();
    // const nodeVersion = window.versions.node();
    // const elecVersion = window.versions.electron();

    return (
      <div>
        <PanelGroup direction="horizontal">
          <Panel defaultSize={20}>
            <CardSetsTree {...this.props} onSetsSelected={this.onCardSetsSelected}/>
          </Panel>
          <PanelResizeHandle />
          <Panel>
              <CardsTable {...this.props} onCardSelected={this.onCardSelected}></CardsTable>
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
  }
  //#endregion

  private onCardSetsSelected(setIds: Array<string>): void {
    console.log("Card set selected in tree", setIds);
  }

  private onCardSelected(cardId?: string): void {
    console.log("Card selected in table", cardId);
  }
}
