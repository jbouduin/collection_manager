import * as React from "react";
import { BaseTreeViewProps } from "./base-tree.props";
import { BaseReducer, getTreeNodeItemsRecursive } from "./base-reducer";
import { Classes, Tree, TreeNodeInfo } from "@blueprintjs/core";
import { NodePath } from "./types";
import classNames from "classnames";

export function BaseTreeView<TData, TFilter>(props: BaseTreeViewProps<TData, TFilter>) {

  //#region State -------------------------------------------------------------
  const [nodes, dispatch] = React.useReducer(BaseReducer, undefined);
  //#endregion

  //#region Effect ------------------------------------------------------------
  React.useEffect(
    () => {
      dispatch({
        type: "FILTER",
        payload: props.buildTree(props.applyFilterProps(props.data, props.filterProps), props.filterProps)
      });
    },
    [props.filterProps, props.data]
  );
  //#endregion

  //#region event handlers ----------------------------------------------------
  const handleNodeClick = React.useCallback(
    (node: TreeNodeInfo<TData>, nodePath: NodePath) => {
      const originallySelected = node.isSelected;
      dispatch({ type: "DESELECT_ALL" });
      dispatch({
        payload: { path: nodePath, isSelected: originallySelected == null ? true : !originallySelected },
        type: "SET_IS_SELECTED",
      });
      props.onDataSelected(getTreeNodeItemsRecursive<TData>(node, null));
    },
    [],
  );

  const handleNodeCollapse = React.useCallback(
    (_node: TreeNodeInfo<TData>, nodePath: NodePath) => {
      dispatch({
        payload: { path: nodePath, isExpanded: false },
        type: "SET_IS_EXPANDED",
      });
    },
    []
  );

  const handleNodeExpand = React.useCallback(
    (_node: TreeNodeInfo<TData>, nodePath: NodePath) => {
      dispatch({
        payload: { path: nodePath, isExpanded: true },
        type: "SET_IS_EXPANDED",
      });
    },
    []
  );
  //#endregion

  //#region Main --------------------------------------------------------------
  return (
    <>
      <Tree
        compact={true}
        contents={nodes}
        onNodeClick={handleNodeClick}
        onNodeCollapse={handleNodeCollapse}
        onNodeExpand={handleNodeExpand}
        className={classNames(Classes.ELEVATION_0, "card-set-tree")}
      />
    </>
  );
  //#endregion
}
