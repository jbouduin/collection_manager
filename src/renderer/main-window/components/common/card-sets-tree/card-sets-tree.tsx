import * as React from "react";
import { CardSetTreeProps } from "./card-sets-tree.props";
import { Classes, ContextMenu, Menu, MenuItem, Tree, TreeNodeInfo } from "@blueprintjs/core";
import { CardSetTreeState } from "./card-sets-tree.state";
import { CardSetSelectDto } from "../../../../../common/dto";
import { SvgProvider } from "../svg-provider/svg-provider";
import { CardSyncOptions, IQueryOrSyncParam } from "../../../../../common/ipc-params";

export class CardSetsTree extends React.PureComponent<CardSetTreeProps, CardSetTreeState> {

  //#region Constructor & C° --------------------------------------------------
  public constructor(props: CardSetTreeProps) {
    super(props);
    this.state = {
      nodes: new Array<TreeNodeInfo<CardSetSelectDto>>(),
      currentSelectedPath: null,
      currentSelectedSets: null
    };
  }

  public componentDidMount(): void {
    window.ipc.query({ type: "CardSet", options: null })
      .then((cardSets: Array<CardSetSelectDto>) => this.setState({ nodes: this.buildTree(cardSets, null) }));
  }
  //#endregion


  //#region React methods -----------------------------------------------------
  public render(): React.ReactNode {
    return (
      <Tree
        compact={true}
        contents={this.state.nodes}
        onNodeClick={this.handleNodeClick.bind(this)}
        onNodeCollapse={this.handleNodeCollapse.bind(this)}
        onNodeExpand={this.handleNodeExpand.bind(this)}
        className={Classes.ELEVATION_0}
      />
    );
  }
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


  //#region Private methods ---------------------------------------------------
  private forNodeAtPath(
    nodes: Array<TreeNodeInfo>,
    path: Array<number>,
    callbackForNode: (node: TreeNodeInfo) => void): void {
    callbackForNode(Tree.nodeFromPath(path, nodes));
    this.setState({
      nodes: this.state.nodes,
      currentSelectedPath: this.state.currentSelectedPath,
      currentSelectedSets: this.state.currentSelectedSets
    });
    this.forceUpdate(); // otherwise nothing happens
  }

  private setNodeSelected(nodes: Array<TreeNodeInfo<CardSetSelectDto>>, path: Array<number>): void {
    const nodeToUnselect: TreeNodeInfo = this.state.currentSelectedPath ?
      Tree.nodeFromPath(this.state.currentSelectedPath, nodes) : null;
    const nodeToSelect = Tree.nodeFromPath<CardSetSelectDto>(path, nodes);
    if (nodeToUnselect) {
      nodeToUnselect.isSelected = false;
    }
    nodeToSelect.isSelected = true;
    const currentSelectedSets = this.getTreeNodeItemsRecursive(nodeToSelect);
    this.setState({
      nodes: this.state.nodes,
      currentSelectedPath: path,
      currentSelectedSets: currentSelectedSets
    });
    this.props.onSetsSelected(currentSelectedSets.map((set: CardSetSelectDto) => set.cardSet.id));
  }

  private getTreeNodeItemsRecursive(node: TreeNodeInfo<CardSetSelectDto>, items?: Array<CardSetSelectDto>): Array<CardSetSelectDto> {
    const result = items ?? new Array<CardSetSelectDto>();
    result.push(node.nodeData);
    node.childNodes?.forEach((child: TreeNodeInfo<CardSetSelectDto>) => this.getTreeNodeItemsRecursive(child, result));
    return result;
  }

  private buildTree(items: Array<CardSetSelectDto>, id: string | undefined): Array<TreeNodeInfo<CardSetSelectDto>> {
    return items
      .filter((item: CardSetSelectDto) => item.cardSet.parent_set_code === id)
      .map(item => {
        const childNodes: Array<TreeNodeInfo<CardSetSelectDto>> = this.buildTree(items, item.cardSet.code);
        const node: TreeNodeInfo<CardSetSelectDto> = {
          id: item.cardSet.id,
          label: (
            <ContextMenu  {...this.props} className="set-tree-item" content={<Menu><MenuItem text="Synchronize" onClick={(e) => { e.preventDefault(); this.synchronizeSet(item.cardSet.code); }} /></Menu>}>

              <SvgProvider className="tree-view-image" width={26} svg={item.svg} />
              {item.cardSet.name}
            </ContextMenu>
          ),
          isExpanded: false,
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
    console.log("before");
    window.ipc.sync(params);
    console.log("after");
  }
  //#endregion
}
