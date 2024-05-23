import classNames from "classnames";
import * as _ from "lodash";
import * as React from "react";

import { Classes, ContextMenu, Menu, MenuItem, Tree, TreeNodeInfo } from "@blueprintjs/core";
import { CardSetTreeProps } from "./card-sets-tree.props";
import { DtoCardSet } from "../../../../../common/dto";
import { CardSyncOptions, SyncParam } from "../../../../../common/ipc-params";
import { SvgProvider } from "../svg-provider/svg-provider";

type NodePath = Array<number>;

type TreeAction =
  | { type: "SET_IS_EXPANDED"; payload: { path: NodePath; isExpanded: boolean } }
  | { type: "DESELECT_ALL"; }
  | { type: "SET_IS_SELECTED"; payload: { path: NodePath; isSelected: boolean } };

function forEachNode(nodes: Array<TreeNodeInfo> | undefined, callback: (node: TreeNodeInfo) => void) {
  if (!nodes) {
    return;
  }
  for (const node of nodes as Array<TreeNodeInfo>) {
    callback(node);
    forEachNode(node.childNodes, callback);
  }
}

function forNodeAtPath(nodes: Array<TreeNodeInfo>, path: NodePath, callback: (node: TreeNodeInfo) => void) {
  callback(Tree.nodeFromPath(path, nodes));
}

function treeExampleReducer(state: Array<TreeNodeInfo>, action: TreeAction) {
  const newState = _.cloneDeep(state);
  switch (action.type) {
    case "DESELECT_ALL":
      forEachNode(newState, node => (node.isSelected = false));
      return newState;
    case "SET_IS_EXPANDED":
      forNodeAtPath(newState, action.payload.path, node => (node.isExpanded = action.payload.isExpanded));
      return newState;
    case "SET_IS_SELECTED":
      forNodeAtPath(newState, action.payload.path, node => (node.isSelected = action.payload.isSelected));
      return newState;
    default:
      return state;
  }
}

export function CardSetsTree(props: CardSetTreeProps) {
  console.log("in cardsetstree function");

  //#region State -------------------------------------------------------------
  const [nodes, dispatch] = React.useReducer(treeExampleReducer, buildTree(props.cardSets, null));
  // const [currentSelectedPath, setCurrentSelectedPath] = React.useState(new Array<number>());
  //#endregion

  //#region event handlers ----------------------------------------------------
  const handleNodeClick = React.useCallback(
    (node: TreeNodeInfo<DtoCardSet>, nodePath: NodePath) => {
      // LATER by dispatching twice, we are re-rendering twice
      const originallySelected = node.isSelected;
      // LATER multi select:
      // add parameter "e: React.MouseEvent<HTMLElement>" to the callback and...
      // if (!e.shiftKey) {
        dispatch({ type: "DESELECT_ALL" });
      // }
      dispatch({
        payload: { path: nodePath, isSelected: originallySelected == null ? true : !originallySelected },
        type: "SET_IS_SELECTED",
      });
      props.onSetsSelected(getTreeNodeItemsRecursive(node, null));
    },
    [],
  );

  const handleNodeCollapse = React.useCallback((_node: TreeNodeInfo, nodePath: NodePath) => {
    dispatch({
      payload: { path: nodePath, isExpanded: false },
      type: "SET_IS_EXPANDED",
    });
  }, []);

  const handleNodeExpand = React.useCallback((_node: TreeNodeInfo, nodePath: NodePath) => {
    dispatch({
      payload: { path: nodePath, isExpanded: true },
      type: "SET_IS_EXPANDED",
    });
  }, []);
  //#endregion

  //#region Private methods ---------------------------------------------------
  function buildTree(items: Array<DtoCardSet>, id: string | undefined): Array<TreeNodeInfo<DtoCardSet>> {
    return items
      .filter((item: DtoCardSet) => item.parent_set_code === id)
      .map(item => {
        const childNodes: Array<TreeNodeInfo<DtoCardSet>> = buildTree(items, item.code);
        const node: TreeNodeInfo<DtoCardSet> = {
          id: item.id,
          label: (
            <ContextMenu className={classNames("set-tree-item", props.className)} content={<Menu><MenuItem text="Synchronize" onClick={(e) => { e.preventDefault(); synchronizeSet(item.code); }} /></Menu>}>

              <SvgProvider className={classNames("tree-view-image", props.className)} width={26} svg={item.svg} />
              {item.name}
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

  function getTreeNodeItemsRecursive(node: TreeNodeInfo<DtoCardSet>, items?: Array<DtoCardSet>): Array<DtoCardSet> {
    const result = items ?? new Array<DtoCardSet>();
    result.push(node.nodeData);
    node.childNodes?.forEach((child: TreeNodeInfo<DtoCardSet>) => getTreeNodeItemsRecursive(child, result));
    return result;
  }

  function synchronizeSet(code: string): void {
    const params: SyncParam<CardSyncOptions> = {
      type: "Card",
      options: { source: "user", setCode: code }
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
    className={classNames(Classes.ELEVATION_0, props.className)}
  />);
  //#endregion
}
