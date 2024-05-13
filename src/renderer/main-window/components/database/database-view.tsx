import { Card, Classes, ContextMenu, Menu, MenuItem, Props, Tree, TreeNodeInfo } from "@blueprintjs/core";
import * as React from "react";

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { CardSetSelectDto } from "../../../../common/dto";
import { CardSyncOptions, IQueryOrSyncParam } from "../../../../common/ipc-params";
import { CardsTable } from "../common/tables/cards-table";
import { DatabaseViewState } from "./database-view.state";


export class DatabaseView extends React.Component<Props, DatabaseViewState> {

  //#region Private readonly properties ---------------------------------------
  private readonly contentSizing = { popoverProps: { popoverClassName: Classes.POPOVER_CONTENT_SIZING } };
  //#endregion

  //#region Event handlers ----------------------------------------------------
  private handleNodeCollapse(_node: TreeNodeInfo<CardSetSelectDto>, nodePath: Array<number>, _e: React.MouseEvent<HTMLElement>): void {
    this.forNodeAtPath(this.state.nodes, nodePath, (node => node.isExpanded = false));
  }

  private handleNodeClick(_node: TreeNodeInfo<CardSetSelectDto>, nodePath: Array<number>, _e: React.MouseEvent<HTMLElement>): void {
    this.setNodeSelected(this.state.nodes, nodePath);
  }

  private handleNodeExpand(_node: TreeNodeInfo<CardSetSelectDto>, nodePath: Array<number>, _e: React.MouseEvent<HTMLElement, MouseEvent>): void {
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
    // LATER Move to about dialog
    // const chromeVersion = window.versions.chrome();
    // const nodeVersion = window.versions.node();
    // const elecVersion = window.versions.electron();
    const compact = true;

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
              <CardsTable {...this.props}></CardsTable>
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
            <ContextMenu  {...this.props} content={<Menu><MenuItem text="Synchronize" onClick={(e) => { e.preventDefault(); this.synchronizeSet(item.code); }} /></Menu>}>
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

  private synchronizeSet(code: string): void {
    const params: IQueryOrSyncParam<CardSyncOptions> = {
      type: "Card",
      options: { setCode: code }
    };
    window.ipc.sync(params);
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
