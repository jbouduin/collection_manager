import { Classes, ContextMenu, Menu, MenuItem, Tree, TreeNodeInfo } from "@blueprintjs/core";
import classNames from "classnames";
import * as _ from "lodash";
import * as React from "react";

import { CardSetViewmodel } from "../../../../viewmodels";
import { SvgProvider } from "../../svg-provider/svg-provider";
import { TreeViewProps } from "./tree-view.props";

type NodePath = Array<number>;

type TreeAction =
  | { type: "SET_IS_EXPANDED"; payload: { path: NodePath; isExpanded: boolean } }
  | { type: "DESELECT_ALL"; }
  | { type: "SET_IS_SELECTED"; payload: { path: NodePath; isSelected: boolean } }
  | { type: "FILTER"; payload: Array<TreeNodeInfo> };

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
    case "FILTER":
      return action.payload;
    default:
      return state;
  }
}

export function TreeView(props: TreeViewProps) {
  console.log("in treeview function", props.textFilter);

  //#region State -------------------------------------------------------------
  const [nodes, dispatch] = React.useReducer(treeExampleReducer, undefined);

  //#endregion

  //#region event handlers ----------------------------------------------------
  const handleNodeClick = React.useCallback(
    (node: TreeNodeInfo<CardSetViewmodel>, nodePath: NodePath) => {
      const originallySelected = node.isSelected;
      // LATER multi select
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
  },
    []
  );

  const handleNodeExpand = React.useCallback(
    (_node: TreeNodeInfo, nodePath: NodePath) => {
      dispatch({
        payload: { path: nodePath, isExpanded: true },
        type: "SET_IS_EXPANDED",
      });
    },
    []
  );
  //#endregion

  //#region Effect ------------------------------------------------------------
  React.useEffect(() => {
    dispatch({
      type: "FILTER",
      payload: buildTree(applyFilterProps(props.cardSets))
    });
  },
    [props.cardSetGroupBy, props.cardSetSort, props.cardSetTypeFilter, props.textFilter]
  );
  //#endregion

  //#region Auxiliary build tree methods --------------------------------------
  function applyFilterProps(items: Array<CardSetViewmodel>): Array<CardSetViewmodel> {
    const result = items.filter((cardSet: CardSetViewmodel) =>
      (props.textFilter ? (cardSet.cardSetName.toUpperCase().indexOf(props.textFilter.toUpperCase()) >= 0) : true) &&
      props.cardSetTypeFilter[cardSet.cardSetType] == true
    );
    if (props.cardSetGroupBy == "parent") {
      let parents = result
        .filter((cardSet: CardSetViewmodel) => cardSet.parentSetCode != null)
        .map((cardSet: CardSetViewmodel) => items.find((parent: CardSetViewmodel) => parent.setCode == cardSet.parentSetCode));
      let uniqueParents = [
        ...new Map(parents.map((parent: CardSetViewmodel) => [parent["setCode"], parent])).values()
      ];
      while (uniqueParents.length > 0) {
        result.push(...uniqueParents);
        parents = parents
          .filter((cardSet: CardSetViewmodel) => cardSet.parentSetCode != null)
          .map((cardSet: CardSetViewmodel) => items.find((parent: CardSetViewmodel) => parent.setCode == cardSet.parentSetCode));
        uniqueParents = [
          ...new Map(parents.map((parent: CardSetViewmodel) => [parent["setCode"], parent])).values()
        ];
      }
      const uniqueResult = [
        ...new Map(result.map((r: CardSetViewmodel) =>
          [r["setCode"], r])).values()
      ];
      return uniqueResult;
    } else {
      return result;
    }
  }

  function buildTree(cardSets: Array<CardSetViewmodel>): Array<TreeNodeInfo<CardSetViewmodel | string>> {
    switch (props.cardSetGroupBy) {
      case "parent":
        return buildTreeByParent(cardSets);
      case "block":
        return buildTreeByBlockOrType(cardSets, (cardSet: CardSetViewmodel) => cardSet.block);
      case "none":
        return buildTreeByNone(cardSets);
      case "setType":
        return buildTreeByBlockOrType(cardSets, (cardSet: CardSetViewmodel) => cardSet.cardSetType);
    }
  }

  function buildTreeByParent(cardSets: Array<CardSetViewmodel>): Array<TreeNodeInfo<CardSetViewmodel>> {
    return buildTreeByParentRecursive(cardSets, null);
  }

  function buildTreeByParentRecursive(cardSets: Array<CardSetViewmodel>, id: string | null): Array<TreeNodeInfo<CardSetViewmodel>> {
    return cardSets
      .filter((item: CardSetViewmodel) => item.parentSetCode === id)
      .sort(sortViewmodelfunction)
      .map((cardSet: CardSetViewmodel) => {
        const childNodes: Array<TreeNodeInfo<CardSetViewmodel>> = buildTreeByParentRecursive(cardSets, cardSet.setCode);
        const node = mapViewModelToTreeItem(cardSet);
        node.childNodes = childNodes.length > 0 ? childNodes : null;
        return node;
      });
  }

  function buildTreeByBlockOrType(cardSets: Array<CardSetViewmodel>, groupFieldFunction: (cardSet: CardSetViewmodel) => string): Array<TreeNodeInfo<CardSetViewmodel | string>> {
    const groups = [
      ...new Set(cardSets.map((cardSet: CardSetViewmodel) => groupFieldFunction(cardSet)))];
    groups.sort((a: string, b: string) => (a ?? "zzz").toUpperCase().localeCompare((b ?? "zzz").toUpperCase()));
    return groups.map((group: string) => {
      const groupNode: TreeNodeInfo<CardSetViewmodel | string> = {
        id: group ?? "none",
        label: group ? _.upperFirst(group).replace("_", " ") : "None",
        isExpanded: false,
        isSelected: false,
        nodeData: group ?? "none",
        childNodes: cardSets
          .filter((cardSet: CardSetViewmodel) => groupFieldFunction(cardSet) == group)
          .sort(sortViewmodelfunction)
          .map(mapViewModelToTreeItem)
      };
      return groupNode;
    });
  }

  function buildTreeByNone(cardSets: Array<CardSetViewmodel>): Array<TreeNodeInfo<CardSetViewmodel>> {
    return cardSets
      .sort(sortViewmodelfunction)
      .map((cardSet: CardSetViewmodel) => mapViewModelToTreeItem(cardSet));
  }

  function sortViewmodelfunction(a: CardSetViewmodel, b: CardSetViewmodel): number {
    switch (props.cardSetSort) {
      case "alphabeticallyAscending":
        return a.cardSetName.localeCompare(b.cardSetName);
      case "alphabeticallyDescending":
        return - a.cardSetName.localeCompare(b.cardSetName);
      case "releaseDateAscending":
        return a.releaseDateIsoString.localeCompare(b.releaseDateIsoString);
      case "releaseDateDescending":
        return - a.releaseDateIsoString.localeCompare(b.releaseDateIsoString);
    }
  }

  // TODO this creates as much virtual targets as there are sets in the tree
  // check how to put Contextmenu on tree itself and pass set under cursor to the methods
  function mapViewModelToTreeItem(cardSet: CardSetViewmodel): TreeNodeInfo<CardSetViewmodel> {
    const node: TreeNodeInfo<CardSetViewmodel> = {
      id: cardSet.id,
      label: (
        <ContextMenu
          className="set-tree-item"
          content={
            <Menu>
              <MenuItem
                text="Synchronize cards"
                onClick={(e) => { e.preventDefault();  props.onSynchronizeSet(cardSet.setCode); }}
              />
              <MenuItem
                text="Properties"
                onClick={(e) => { e.preventDefault(); props.onCardSetDialog(cardSet); }}
              />
            </Menu>}>
          <SvgProvider key={cardSet.setCode} className="tree-view-image" width={26} svg={cardSet.cardSetSvg} />
          {cardSet.treeItemLabel}
        </ContextMenu>
      ),
      isExpanded: false,
      isSelected: false,
      nodeData: cardSet
    };
    return node;
  }
  //#endregion

  //#region Other auxiliary methods -------------------------------------------
  function getTreeNodeItemsRecursive(node: TreeNodeInfo<CardSetViewmodel>, items?: Array<CardSetViewmodel>): Array<CardSetViewmodel> {
    const result = items ?? new Array<CardSetViewmodel>();
    result.push(node.nodeData);
    node.childNodes?.forEach((child: TreeNodeInfo<CardSetViewmodel>) => getTreeNodeItemsRecursive(child, result));
    return result;
  }
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
