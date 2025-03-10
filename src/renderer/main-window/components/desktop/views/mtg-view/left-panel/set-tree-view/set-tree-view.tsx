import { ContextMenu, Menu, MenuItem, TreeNodeInfo } from "@blueprintjs/core";
import { cloneDeep, isEqual, upperFirst } from "lodash";
import * as React from "react";
import { CardSetGroupBy, CardSetSort, CardSetType } from "../../../../../../../../common/types";
import { CardSetViewmodel, TreeConfigurationViewmodel } from "../../../../../../viewmodels";
import { BaseTreeView, BaseTreeViewProps } from "../../../../../common/base-tree-view";
import { SvgProvider } from "../../../../../common/svg-provider/svg-provider";
import { CardSetContext } from "../../../../../context";
import { CardSetDialog } from "../../../../card-set-dialog/card-set-dialog";
import { HeaderView } from "../header-view/header-view";
import { LeftPanelProps } from "./set-tree-view.props";

const Treeview = React.memo(
  BaseTreeView<CardSetViewmodel, TreeConfigurationViewmodel>,
  (prev: BaseTreeViewProps<CardSetViewmodel, TreeConfigurationViewmodel>, next: BaseTreeViewProps<CardSetViewmodel, TreeConfigurationViewmodel>) => {
    return isEqual(prev.data, next.data) && isEqual(prev.filterProps, next.filterProps);
  }
);

export function SetTreeView(props: LeftPanelProps) {
  //#region State -------------------------------------------------------------
  const [state, setState] = React.useState<TreeConfigurationViewmodel>(new TreeConfigurationViewmodel(props.configuration));
  const [selectedCardSetForDialog, setSelectedCardSetForDialog] = React.useState<CardSetViewmodel>(undefined);
  //#endregion

  //#region event handling ----------------------------------------------------
  const onTextFilterChanged = (textFilterValue: string) => {
    const newState = new TreeConfigurationViewmodel(cloneDeep(state.dto));
    newState.cardSetFilterValue = textFilterValue;
    setState(newState);
  };

  const onCardSetSortChanged = (cardSetSort: CardSetSort) => {
    const newState = new TreeConfigurationViewmodel(cloneDeep(state.dto));
    newState.cardSetFilterValue = state.cardSetFilterValue;
    newState.cardSetSort = cardSetSort;
    setState(newState);
  };

  const onCardSetGroupByChanged = (cardSetGroupBy: CardSetGroupBy) => {
    const newState = new TreeConfigurationViewmodel(cloneDeep(state.dto));
    newState.cardSetFilterValue = state.cardSetFilterValue;
    newState.cardSetGroupBy = cardSetGroupBy;
    setState(newState);
  };

  const onCardSetTypeFilterChanged = (cardSetType: CardSetType) => {
    const newState = new TreeConfigurationViewmodel(cloneDeep(state.dto));
    newState.cardSetFilterValue = state.cardSetFilterValue;
    newState.toggleCardSetFilterType(cardSetType);
    setState(newState);
  };
  //#endregion

  //#region Event handling ----------------------------------------------------
  function applyFilterProps(data: Array<CardSetViewmodel>, filterProps: TreeConfigurationViewmodel): Array<CardSetViewmodel> {
    const result = data.filter((cardSet: CardSetViewmodel) => {
      return (filterProps.cardSetFilterValue ? cardSet.cardSetName.toUpperCase().indexOf(filterProps.cardSetFilterValue.toUpperCase()) >= 0 : true) &&
        filterProps.cardSetTypeFilter.indexOf(cardSet.cardSetType) >= 0;
    });
    if (filterProps.cardSetGroupBy == "parent") {
      let parents = result
        .filter((cardSet: CardSetViewmodel) => cardSet.parentSetCode != null)
        .map((cardSet: CardSetViewmodel) => data.find((parent: CardSetViewmodel) => parent.setCode == cardSet.parentSetCode));
      let uniqueParents = [...new Map(parents.map((parent: CardSetViewmodel) => [parent["setCode"], parent])).values()];
      while (uniqueParents.length > 0) {
        result.push(...uniqueParents);
        parents = parents
          .filter((cardSet: CardSetViewmodel) => cardSet.parentSetCode != null)
          .map((cardSet: CardSetViewmodel) => data.find((parent: CardSetViewmodel) => parent.setCode == cardSet.parentSetCode));
        uniqueParents = [...new Map(parents.map((parent: CardSetViewmodel) => [parent["setCode"], parent])).values()];
      }
      const uniqueResult = [...new Map(result.map((r: CardSetViewmodel) => [r["setCode"], r])).values()];
      return uniqueResult;
    } else {
      return result;
    }
  }

  function buildTree(data: Array<CardSetViewmodel>, props: TreeConfigurationViewmodel): Array<TreeNodeInfo<string | CardSetViewmodel>> {
    switch (props.cardSetGroupBy) {
      case "parent":
        return buildTreeByParent(data);
      case "block":
        return buildTreeByBlockOrType(data, (cardSet: CardSetViewmodel) => cardSet.block);
      case "none":
        return buildTreeByNone(data);
      case "setType":
        return buildTreeByBlockOrType(data, (cardSet: CardSetViewmodel) => cardSet.cardSetType);
    }
  }
  //#endregion

  //#region Main --------------------------------------------------------------
  return (
    <>
      <HeaderView
        cardSetGroupBy={state.cardSetGroupBy}
        cardSetSort={state.cardSetSort}
        cardSetTypeFilter={state.cardSetTypeFilter}
        onCardSetGroupByChanged={onCardSetGroupByChanged}
        onCardSetSortChanged={onCardSetSortChanged}
        onCardSetTypeFilterChanged={onCardSetTypeFilterChanged}
        onTextFilterChanged={onTextFilterChanged}
      />
      <CardSetContext.Consumer>
        {
          (cardSets: Array<CardSetViewmodel>) => (
            <Treeview
              buildTree={buildTree}
              data={cardSets}
              filterProps={{ filter: state, applyFilterProps: applyFilterProps }}
              onDataSelected={(sets: Array<CardSetViewmodel>) => props.onSetsSelected(sets)}
            />
          )
        }
      </CardSetContext.Consumer>
      {
        selectedCardSetForDialog &&
        <CardSetDialog
          cardSetId={selectedCardSetForDialog.id}
          cardSetSvg={selectedCardSetForDialog.cardSetSvg}
          isOpen={true}
          onDialogClose={() => setSelectedCardSetForDialog(null)}
        />
      }
    </>
  );
  //#endregion

  //#region Auxiliary tree related methods ------------------------------------
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
    const groups = [...new Set(cardSets.map((cardSet: CardSetViewmodel) => groupFieldFunction(cardSet)))];
    groups.sort((a: string, b: string) => (a ?? "zzz").toUpperCase().localeCompare((b ?? "zzz").toUpperCase()));
    return groups.map((group: string) => {
      const groupNode: TreeNodeInfo<CardSetViewmodel | string> = {
        id: group ?? "none",
        label: group ? upperFirst(group).replace("_", " ") : "None",
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
    switch (state.cardSetSort) {
      case "alphabeticallyAscending":
        return a.cardSetName.localeCompare(b.cardSetName);
      case "alphabeticallyDescending":
        return -a.cardSetName.localeCompare(b.cardSetName);
      case "releaseDateAscending":
        return a.releaseDateIsoString.localeCompare(b.releaseDateIsoString);
      case "releaseDateDescending":
        return -a.releaseDateIsoString.localeCompare(b.releaseDateIsoString);
    }
  }

  /*
   * TODO this creates as much virtual targets as there are sets in the tree
   * check how to put Contextmenu on tree itself and pass set under cursor to the methods
   */
  function mapViewModelToTreeItem(cardSet: CardSetViewmodel): TreeNodeInfo<CardSetViewmodel> {
    const node: TreeNodeInfo<CardSetViewmodel> = {
      id: cardSet.id,
      label: (
        <ContextMenu
          className="set-tree-item"
          content={
            <Menu>
              <MenuItem
                onClick={
                  (e) => {
                    e.preventDefault();
                    props.onSynchronizeSet(cardSet.setCode);
                  }
                }
                text="Synchronize cards"
              />
              <MenuItem
                onClick={
                  (e) => {
                    e.preventDefault();
                    setSelectedCardSetForDialog(cardSet);
                  }
                }
                text="Properties"
              />
            </Menu>
          }
        >
          <SvgProvider
            className="tree-view-image"
            key={cardSet.setCode}
            svg={cardSet.cardSetSvg}
            width={26}
          />
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
}
