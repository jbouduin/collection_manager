import * as React from "react";
import { CardSetTreeProps } from "./card-sets-tree.props";
import { Classes, ContextMenu, Menu, MenuItem, Tree, TreeNodeInfo } from "@blueprintjs/core";
// import { CardSetTreeState } from "./card-sets-tree.state";
import { CardSetSelectDto } from "../../../../../common/dto";
import { SvgProvider } from "../svg-provider/svg-provider";
import { CardSyncOptions, IQueryOrSyncParam } from "../../../../../common/ipc-params";

export function CardSetsTree(props: CardSetTreeProps) {
  console.log("in cardsetstree function");

  //#region State -------------------------------------------------------------
  const [nodes, setNodes] = React.useState(buildTree(props.cardSets, null));
  const [currentSelectedPath, setCurrentSelectedPath] = React.useState(new Array<number>());
  //#endregion

  //#region event handlers ----------------------------------------------------
  function handleNodeCollapse(_node: TreeNodeInfo<CardSetSelectDto>, nodePath: Array<number>, _e: React.MouseEvent<HTMLElement>): void {
    forNodeAtPath(nodes, nodePath, (node => node.isExpanded = false));
  }

  function handleNodeClick(_node: TreeNodeInfo<CardSetSelectDto>, nodePath: Array<number>, _e: React.MouseEvent<HTMLElement>): void {
    setNodeSelected(nodes, nodePath);
  }

  function handleNodeExpand(_node: TreeNodeInfo<CardSetSelectDto>, nodePath: Array<number>, _e: React.MouseEvent<HTMLElement, MouseEvent>): void {
    forNodeAtPath(nodes, nodePath, (node => node.isExpanded = true));
  }
  //#endregion

  //#region Private methods ---------------------------------------------------
  function forNodeAtPath(
    inputNodes: Array<TreeNodeInfo<CardSetSelectDto>>,
    path: Array<number>,
    callbackForNode: (node: TreeNodeInfo) => void): void {
    callbackForNode(Tree.nodeFromPath(path, nodes));
    setNodes(nodes);
    // this.forceUpdate(); // otherwise nothing happens
  }

  function setNodeSelected(nodes: Array<TreeNodeInfo<CardSetSelectDto>>, path: Array<number>): void {
    const nodeToUnselect: TreeNodeInfo = currentSelectedPath.length > 0 ?
      Tree.nodeFromPath(currentSelectedPath, nodes) : null;
    const nodeToSelect = Tree.nodeFromPath<CardSetSelectDto>(path, nodes);
    if (nodeToUnselect) {
      nodeToUnselect.isSelected = false;
    }
    nodeToSelect.isSelected = true;
    const currentSelectedSets = getTreeNodeItemsRecursive(nodeToSelect);
    setCurrentSelectedPath(path);
    setNodes(nodes);
    props.onSetsSelected(currentSelectedSets.map((set: CardSetSelectDto) => set.cardSet.id));
  }

  function getTreeNodeItemsRecursive(node: TreeNodeInfo<CardSetSelectDto>, items?: Array<CardSetSelectDto>): Array<CardSetSelectDto> {
    const result = items ?? new Array<CardSetSelectDto>();
    result.push(node.nodeData);
    node.childNodes?.forEach((child: TreeNodeInfo<CardSetSelectDto>) => getTreeNodeItemsRecursive(child, result));
    return result;
  }

  function buildTree(items: Array<CardSetSelectDto>, id: string | undefined): Array<TreeNodeInfo<CardSetSelectDto>> {
    return items
      .filter((item: CardSetSelectDto) => item.cardSet.parent_set_code === id)
      .map(item => {
        const childNodes: Array<TreeNodeInfo<CardSetSelectDto>> = buildTree(items, item.cardSet.code);
        const node: TreeNodeInfo<CardSetSelectDto> = {
          id: item.cardSet.id,
          label: (
            <ContextMenu  {...props} className="set-tree-item" content={<Menu><MenuItem text="Synchronize" onClick={(e) => { e.preventDefault(); synchronizeSet(item.cardSet.code); }} /></Menu>}>

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

  function synchronizeSet(code: string): void {
    const params: IQueryOrSyncParam<CardSyncOptions> = {
      type: "Card",
      options: { setCode: code }
    };
    console.log("before");
    window.ipc.sync(params);
    console.log("after");
  }
  //#endregion

  //#region Main --------------------------------------------------------------
  return (<Tree
    compact={true}
    contents={nodes}
    onNodeClick={handleNodeClick}
    onNodeCollapse={handleNodeCollapse}
    onNodeExpand={handleNodeExpand}
    className={Classes.ELEVATION_0}
  />);
  //#endregion
}
