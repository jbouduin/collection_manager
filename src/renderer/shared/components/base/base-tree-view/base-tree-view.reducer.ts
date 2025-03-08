import { Tree, TreeNodeInfo } from "@blueprintjs/core";
import { NodePath, BaseTreeViewAction } from "./types";
import { cloneDeep } from "lodash";
import { BaseTreeNodeViewmodel } from "./base-tree-node.viewmodel";

export function BaseTreeViewReducer<TData extends BaseTreeNodeViewmodel>(state: Array<TreeNodeInfo<TData>>, action: BaseTreeViewAction) {
  const newState = cloneDeep(state);
  switch (action.type) {
    case "DESELECT_ALL": {
      forEachNode(
        newState,
        (node: TreeNodeInfo<TData>) => {
          node.isSelected = false;
          node.nodeData.isSelected = false;
        }
      );
      return newState;
    }
    case "SET_IS_EXPANDED": {
      forNodeAtPath(
        newState,
        action.payload.path,
        (node: TreeNodeInfo<TData>) => {
          node.isExpanded = action.payload.isExpanded;
          node.nodeData.isExpanded = action.payload.isExpanded;
        }
      );
    }
      return newState;
    case "SET_IS_SELECTED": {
      forNodeAtPath(
        newState,
        action.payload.path,
        (node: TreeNodeInfo<TData>) => {
          node.isSelected = action.payload.isSelected;
          node.nodeData.isSelected = action.payload.isSelected;
        }
      );
      return newState;
    }
    case "FILTER":
      return action.payload;
    default:
      return state;
  }
}

function forEachNode<TData extends BaseTreeNodeViewmodel>(
  nodes: Array<TreeNodeInfo<TData>> | undefined,
  callback: (node: TreeNodeInfo<TData>) => void
) {
  if (!nodes) {
    return;
  }
  for (const node of nodes) {
    callback(node);
    forEachNode(node.childNodes, callback);
  }
}

function forNodeAtPath<TData extends BaseTreeNodeViewmodel>(
  nodes: Array<TreeNodeInfo<TData>>,
  path: NodePath,
  callback: (node: TreeNodeInfo<TData>) => void
) {
  callback(Tree.nodeFromPath(path, nodes));
}

export function getTreeNodeItemsRecursive<TData extends BaseTreeNodeViewmodel>(
  node: TreeNodeInfo<TData>,
  items?: Array<TData>
): Array<TData> {
  const result = items ?? new Array<TData>();
  result.push(node.nodeData);
  node.childNodes?.forEach((child: TreeNodeInfo<TData>) => getTreeNodeItemsRecursive(child, result));
  return result;
}
