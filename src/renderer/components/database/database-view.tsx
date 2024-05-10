import { Button, Card, Classes, ContextMenu, Props, Tree, TreeNodeInfo } from "@blueprintjs/core";
import * as React from "react";

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { CardSetSelectDto } from "../../../common/dto";
import { CardSetSyncOptions, CardSyncOptions, CatalogSyncOptions, IQueryOrSyncParam } from "../../../common/ipc-params";
import { DatabaseViewState } from "./database-view.state";
import { Cell, Column, Table2 } from "@blueprintjs/table";
import { CardsTable } from "../common/tables/cards-table";


export class DatabaseView extends React.Component<Props, DatabaseViewState> {

  //#region Private readonly properties ---------------------------------------
  private readonly contentSizing = { popoverProps: { popoverClassName: Classes.POPOVER_CONTENT_SIZING } };
  //#endregion

  //#region Event handlers ----------------------------------------------------
  private handleNodeCollapse(node: TreeNodeInfo<CardSetSelectDto>, nodePath: Array<number>, e: React.MouseEvent<HTMLElement>): void {
    this.forNodeAtPath(this.state.nodes, nodePath, (node => node.isExpanded = false));
  }

  private handleNodeClick(node: TreeNodeInfo<CardSetSelectDto>, nodePath: Array<number>, e: React.MouseEvent<HTMLElement>): void {
    this.setNodeSelected(this.state.nodes, nodePath);
  }

  private handleNodeExpand(node: TreeNodeInfo<CardSetSelectDto>, nodePath: Array<number>, e: React.MouseEvent<HTMLElement, MouseEvent>): void {
    this.forNodeAtPath(this.state.nodes, nodePath, (node => node.isExpanded = true));
  }
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
  public componentDidMount(): void {
    window.ipc.query({ type: "CardSet", options: null }).then((r) => {
      const cardSets = r as Array<CardSetSelectDto>;
      this.setState({ nodes: this.buildTree(cardSets, null) });
    });
  }
  //#endregion

  //#region Public methods ----------------------------------------------------
  public render(): React.ReactNode {
    const chromeVersion = window.versions.chrome();
    const nodeVersion = window.versions.node();
    const elecVersion = window.versions.electron();
    const compact = true;
    const ping = "waiting for ping";
    return (
      <div>
        <PanelGroup direction="horizontal">
          <Panel defaultSize={20}>
            <Tree
              compact={compact}
              contents={this.state.nodes}
              onNodeClick={this.handleNodeClick.bind(this)}
              onNodeCollapse={this.handleNodeCollapse.bind(this)}
              onNodeExpand={this.handleNodeExpand.bind(this)}
              className={Classes.ELEVATION_0}
            />
          </Panel>
          <PanelResizeHandle />
          <Panel>
            <Card className={this.props.className}>
              <div>
                <h1>{this.state.currentSelectedSets?.map(x => x.name).join(", ") ?? "No sets selected"}</h1>
                <h2>💖 Hello from React - Blueprint desktop!</h2>
                <p>
                  This app is using Chrome ({chromeVersion}), Node.js ({nodeVersion}), and Electron ({elecVersion})
                </p>
                <p>
                  {ping}
                </p>

                <h3>Sync</h3>
                <Button text="Sync some catalogs" onClick={() => {
                  const param: IQueryOrSyncParam<CatalogSyncOptions> = {
                    type: "Catalog",
                    options: { catalogs: ["AbilityWords", "ArtifactTypes", "LandTypes"] }
                  };
                  window.ipc.sync(param);
                }} />
                <Button text="Sync symbology" onClick={() => {
                  const param: IQueryOrSyncParam<undefined> = {
                    type: "Symbology",
                    options: undefined
                  };
                  window.ipc.sync(param);
                }} />
                <Button text="Sync cardsets" onClick={() => {
                  const param: IQueryOrSyncParam<CardSetSyncOptions> = {
                    type: "CardSet",
                    options: { code: null }
                  };
                  window.ipc.sync(param);
                }} />
                <Button text="Sync UDS" onClick={() => {
                  const param: IQueryOrSyncParam<CardSyncOptions> = {
                    type: "Card",
                    options: { setCode: "UDS" }
                  };
                  window.ipc.sync(param);
                }} />
                <Button text="Sync MKM" onClick={() => {
                  const param: IQueryOrSyncParam<CardSyncOptions> = {
                    type: "Card",
                    options: { setCode: "MKM" }
                  };
                  window.ipc.sync(param);
                }} />
                <Button text="Sync SOI" onClick={() => {
                  const param: IQueryOrSyncParam<CardSyncOptions> = {
                    type: "Card",
                    options: { setCode: "SOI" }
                  };
                  window.ipc.sync(param);
                }} />
                <Button text="Sync TOTP" onClick={() => {
                  const param: IQueryOrSyncParam<CardSyncOptions> = {
                    type: "Card",
                    options: { setCode: "TOTP" }
                  };
                  window.ipc.sync(param);
                }} />

                <h3>Query</h3>
                <Button text="Query Artifact types" onClick={() => window.ipc.query({ type: "Catalog", options: null })} />
                <Button text="Query Sets" onClick={() => window.ipc.query({ type: "CardSet", options: null })} />
                <Button text="Query Language" onClick={() => window.ipc.query({ type: "Language", options: null })} />
                <Button text="Query Colors" onClick={() => window.ipc.query({ type: "Color", options: null })} />
                <Button text="Query Symbology" onClick={() => window.ipc.query({ type: "Symbology", options: null })} />
                <Button text="Query or Sync ruling" onClick={() => window.ipc.queryOrSync({ type: "Ruling", options: { cardId: "bd6e71a1-713e-4eca-bd65-9f0638c16794" } }).then((result) => console.log(result))} />
                <h3>Table</h3>
                <CardsTable {...this.props}></CardsTable>

              </div >
            </Card>

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

  //#region Private methods ---------------------------------------------------
  private getTreeNodeItemsRecursive(node: TreeNodeInfo<CardSetSelectDto>, items?: Array<CardSetSelectDto>): Array<CardSetSelectDto> {
    const result = items ?? new Array<CardSetSelectDto>();
    result.push(node.nodeData);
    node.childNodes?.forEach((child: TreeNodeInfo<CardSetSelectDto>) => this.getTreeNodeItemsRecursive(child, result));
    return result;
  }

  private buildTree(items: Array<CardSetSelectDto>, id: string | undefined): Array<TreeNodeInfo<CardSetSelectDto>> {
    return items
      .filter((item: CardSetSelectDto) => item.parent_set_code === id)
      .map(item => {
        const childNodes: Array<TreeNodeInfo<CardSetSelectDto>> = this.buildTree(items, item.code);
        const node: TreeNodeInfo<CardSetSelectDto> = {
          id: item.id,
          label: (
            <ContextMenu {...this.contentSizing} content={<div>{item.name}</div>}>
              {item.name}
            </ContextMenu>
          ),
          isExpanded: false, //!id,
          isSelected: false,
          childNodes: childNodes.length > 0 ? childNodes : null,
          nodeData: item
        };
        return node;
      });
  }

  private forNodeAtPath(
    nodes: Array<TreeNodeInfo>,
    path: Array<number>,
    callbackForNode: (node: TreeNodeInfo) => void): void {
    callbackForNode(Tree.nodeFromPath(path, nodes));
    this.setState(this.state);
  }

  private setNodeSelected(nodes: Array<TreeNodeInfo<CardSetSelectDto>>, path: Array<number>): void {
    const nodeToUnselect: TreeNodeInfo = this.state.currentSelectedPath ?
      Tree.nodeFromPath(this.state.currentSelectedPath, nodes) : null;
    const nodeToSelect = Tree.nodeFromPath<CardSetSelectDto>(path, nodes);
    if (nodeToUnselect) {
      nodeToUnselect.isSelected = false;
    }
    nodeToSelect.isSelected = true;
    this.setState({
      nodes: this.state.nodes,
      currentSelectedPath: path,
      currentSelectedSets: this.getTreeNodeItemsRecursive(nodeToSelect)
    });
  }
  //#endregion

}
