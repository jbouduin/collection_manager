import { Tree, TreeNodeInfo } from "@blueprintjs/core";
import { NodePath, BaseTreeViewAction } from "./types";
import { cloneDeep } from "lodash";

export function BaseTreeViewReducer(state: Array<TreeNodeInfo>, action: BaseTreeViewAction) {
  const newState = cloneDeep(state);
  switch (action.type) {
    case "DESELECT_ALL":
      forEachNode(newState, (node: TreeNodeInfo) => node.isSelected = false);
      return newState;
    case "SET_IS_EXPANDED":
      forNodeAtPath(newState, action.payload.path, (node: TreeNodeInfo) => node.isExpanded = action.payload.isExpanded);
      return newState;
    case "SET_IS_SELECTED":
      forNodeAtPath(newState, action.payload.path, (node: TreeNodeInfo) => node.isSelected = action.payload.isSelected);
      return newState;
    case "FILTER":
      return action.payload;
    default:
      return state;
  }
}

function forEachNode(nodes: Array<TreeNodeInfo> | undefined, callback: (node: TreeNodeInfo) => void) {
  if (!nodes) {
    return;
  }
  for (const node of nodes) {
    callback(node);
    forEachNode(node.childNodes, callback);
  }
}

function forNodeAtPath(nodes: Array<TreeNodeInfo>, path: NodePath, callback: (node: TreeNodeInfo) => void) {
  callback(Tree.nodeFromPath(path, nodes));
}

export function getTreeNodeItemsRecursive<T>(node: TreeNodeInfo<T>, items?: Array<T>): Array<T> {
  const result = items ?? new Array<T>();
  result.push(node.nodeData);
  node.childNodes?.forEach((child: TreeNodeInfo<T>) => getTreeNodeItemsRecursive(child, result));
  return result;
}
