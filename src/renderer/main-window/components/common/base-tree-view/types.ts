import { TreeNodeInfo } from "@blueprintjs/core";

export type NodePath = Array<number>;

export type TreeAction =
  | { type: "SET_IS_EXPANDED"; payload: { path: NodePath; isExpanded: boolean } }
  | { type: "DESELECT_ALL"; }
  | { type: "SET_IS_SELECTED"; payload: { path: NodePath; isSelected: boolean } }
  | { type: "FILTER"; payload: Array<TreeNodeInfo> };
