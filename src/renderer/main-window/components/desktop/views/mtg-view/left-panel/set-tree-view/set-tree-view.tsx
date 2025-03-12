import { ContextMenu, Menu, MenuItem, TreeNodeInfo } from "@blueprintjs/core";
import { cloneDeep, isEqual, upperFirst } from "lodash";
import * as React from "react";
import { IMtgCardSetDto, ISyncParamDto } from "../../../../../../../../common/dto";
import { CardSetGroupBy, CardSetSort, CardSetType } from "../../../../../../../../common/types";
import { IpcProxyService, IpcProxyServiceContext } from "../../../../../../../shared/context";
import { TreeConfigurationViewmodel } from "../../../../../../viewmodels";
import { CardSetTreeViewmodel } from "../../../../../../viewmodels/card-set/card-set-tree.viewmodel";
import { BaseTreeView, BaseTreeViewProps } from "../../../../../../../shared/components/base/base-tree-view";
import { SvgProvider } from "../../../../../../../shared/components/svg-provider/svg-provider";
import { CardSetDialog } from "../../../../card-set-dialog/card-set-dialog";
import { HeaderView } from "../header-view/header-view";
import { LeftPanelProps } from "./set-tree-view.props";

const Treeview = React.memo(
  BaseTreeView<CardSetTreeViewmodel, TreeConfigurationViewmodel>,
  (prev: BaseTreeViewProps<CardSetTreeViewmodel, TreeConfigurationViewmodel>, next: BaseTreeViewProps<CardSetTreeViewmodel, TreeConfigurationViewmodel>) => {
    return isEqual(prev.data?.length, next.data?.length) && isEqual(prev.filterProps.filter, next.filterProps.filter);
  }
);

export function SetTreeView(props: LeftPanelProps) {
  //#region State -------------------------------------------------------------
  const [state, setState] = React.useState<TreeConfigurationViewmodel>(new TreeConfigurationViewmodel(props.configuration));
  const [selectedCardSetForDialog, setSelectedCardSetForDialog] = React.useState<CardSetTreeViewmodel>(undefined);
  //#endregion

  //#region Context ---------------------------------------------------------------------
  const ipcProxyService = React.useContext<IpcProxyService>(IpcProxyServiceContext);
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

  function synchronizeSet(code: string): void {
    props.showSplashScreen();
    const params: ISyncParamDto = {
      catalogTypesToSync: [],
      syncCardSymbols: false,
      syncCardSets: false,
      rulingSyncType: "none",
      cardSyncType: "byCardSet",
      cardSelectionToSync: [],
      cardImageStatusToSync: [],
      syncCardsSyncedBeforeNumber: undefined,
      syncCardsSyncedBeforeUnit: undefined,
      cardSetCodeToSyncCardsFor: code,
      changedImageStatusAction: "delete",
      oracleId: undefined
    };
    void ipcProxyService.postData<ISyncParamDto, never>("/mtg-sync", params)
      .then(
        () => props.hideSplashScreen(null),
        () => props.hideSplashScreen(null)
      );
  }
  //#endregion

  //#region Event handling ----------------------------------------------------
  function applyFilterProps(data: Array<CardSetTreeViewmodel>, filterProps: TreeConfigurationViewmodel): Array<CardSetTreeViewmodel> {
    const result = data.filter((cardSet: CardSetTreeViewmodel) => {
      return (filterProps.cardSetFilterValue ? cardSet.cardSetName.toUpperCase().indexOf(filterProps.cardSetFilterValue.toUpperCase()) >= 0 : true) &&
        filterProps.cardSetTypeFilter.indexOf(cardSet.cardSetType) >= 0;
    });
    if (filterProps.cardSetGroupBy == "parent") {
      let parents = result
        .filter((cardSet: CardSetTreeViewmodel) => cardSet.parentSetCode != null)
        .map((cardSet: CardSetTreeViewmodel) => data.find((parent: CardSetTreeViewmodel) => parent.setCode == cardSet.parentSetCode));
      let uniqueParents = [...new Map(parents.map((parent: CardSetTreeViewmodel) => [parent["setCode"], parent])).values()];
      while (uniqueParents.length > 0) {
        result.push(...uniqueParents);
        parents = parents
          .filter((cardSet: CardSetTreeViewmodel) => cardSet.parentSetCode != null)
          .map((cardSet: CardSetTreeViewmodel) => data.find((parent: CardSetTreeViewmodel) => parent.setCode == cardSet.parentSetCode));
        uniqueParents = [...new Map(parents.map((parent: CardSetTreeViewmodel) => [parent["setCode"], parent])).values()];
      }
      const uniqueResult = [...new Map(result.map((r: CardSetTreeViewmodel) => [r["setCode"], r])).values()];
      return uniqueResult;
    } else {
      return result;
    }
  }

  function buildTree(data: Array<CardSetTreeViewmodel>, props: TreeConfigurationViewmodel): Array<TreeNodeInfo<CardSetTreeViewmodel>> {
    let result: Array<TreeNodeInfo<CardSetTreeViewmodel>>;
    switch (props.cardSetGroupBy) {
      case "parent":
        result = buildTreeByParent(data);
        break;
      case "block":
        result = buildTreeByBlockOrType(data, (cardSet: CardSetTreeViewmodel) => cardSet.block);
        break;
      case "none":
        result = buildTreeByNone(data);
        break;
      case "setType":
        result = buildTreeByBlockOrType(data, (cardSet: CardSetTreeViewmodel) => cardSet.cardSetType);
        break;
    }

    return result;
  }
  //#endregion

  //#region Main --------------------------------------------------------------
  return (
    <>
      <HeaderView
        cardSetGroupBy={state.cardSetGroupBy}
        cardSetSort={state.cardSetSort}
        cardSetTypeFilter={state.cardSetTypeFilter}
        className={props.className}
        onCardSetGroupByChanged={onCardSetGroupByChanged}
        onCardSetSortChanged={onCardSetSortChanged}
        onCardSetTypeFilterChanged={onCardSetTypeFilterChanged}
        onTextFilterChanged={onTextFilterChanged}
      />

      <Treeview
        buildTree={buildTree}
        data={props.cardSets}
        filterProps={{ filter: state, applyFilterProps: applyFilterProps }}
        onDataSelected={(sets: Array<CardSetTreeViewmodel>) => props.onSetsSelected(sets)}
      />

      {
        selectedCardSetForDialog &&
        <CardSetDialog
          cardSetId={selectedCardSetForDialog.id}
          cardSetSvg={selectedCardSetForDialog.cardSetSvg}
          className={props.className}
          isOpen={true}
          onDialogClose={() => setSelectedCardSetForDialog(null)}
        />
      }
    </>
  );
  //#endregion

  //#region Auxiliary tree related methods ------------------------------------
  function buildTreeByParent(cardSets: Array<CardSetTreeViewmodel>): Array<TreeNodeInfo<CardSetTreeViewmodel>> {
    return buildTreeByParentRecursive(cardSets, null);
  }

  function buildTreeByParentRecursive(cardSets: Array<CardSetTreeViewmodel>, id: string | null): Array<TreeNodeInfo<CardSetTreeViewmodel>> {
    return cardSets
      .filter((item: CardSetTreeViewmodel) => item.parentSetCode === id)
      .sort(sortViewmodelfunction)
      .map((cardSet: CardSetTreeViewmodel) => {
        const childNodes: Array<TreeNodeInfo<CardSetTreeViewmodel>> = buildTreeByParentRecursive(cardSets, cardSet.setCode);
        const node = mapViewModelToTreeItem(cardSet);
        node.childNodes = childNodes.length > 0 ? childNodes : null;
        return node;
      });
  }

  function buildTreeByBlockOrType(cardSets: Array<CardSetTreeViewmodel>, groupFieldFunction: (cardSet: CardSetTreeViewmodel) => string): Array<TreeNodeInfo<CardSetTreeViewmodel>> {
    const groups = [...new Set(cardSets.map((cardSet: CardSetTreeViewmodel) => groupFieldFunction(cardSet)))];
    groups.sort((a: string, b: string) => (a ?? "zzz").toUpperCase().localeCompare((b ?? "zzz").toUpperCase()));

    return groups.map((group: string) => {
      const childNodes = cardSets.filter((cardSet: CardSetTreeViewmodel) => groupFieldFunction(cardSet) == group);
      const groupNode: TreeNodeInfo<CardSetTreeViewmodel> = {
        id: group ?? "none",
        label: group ? upperFirst(group).replace("_", " ") : "None",
        isExpanded: false,
        isSelected: false,
        nodeData: new CardSetTreeViewmodel(createDtoForBlockOrType(group ?? "None"), false, false),
        childNodes: childNodes.sort(sortViewmodelfunction).map(mapViewModelToTreeItem)
      };
      return groupNode;
    });
  }

  function createDtoForBlockOrType(group: string): IMtgCardSetDto {
    const groupNodeDto: IMtgCardSetDto = {
      svg: null,
      block: null,
      code: null,
      mtgo_code: null,
      arena_code: null,
      tcgplayer_id: null,
      name: group,
      set_type: "core",
      released_at: undefined,
      block_code: "",
      parent_set_code: "",
      card_count: 0,
      printed_size: 0,
      is_digital: false,
      is_foil_only: false,
      is_nonfoil_only: false,
      scryfall_uri: "",
      uri: "",
      icon_svg_uri: "",
      search_uri: "",
      last_full_synchronization_at: undefined,
      created_at: undefined,
      last_synced_at: undefined,
      id: ""
    };
    return groupNodeDto;
  }

  function buildTreeByNone(cardSets: Array<CardSetTreeViewmodel>): Array<TreeNodeInfo<CardSetTreeViewmodel>> {
    return cardSets
      .sort(sortViewmodelfunction)
      .map((cardSet: CardSetTreeViewmodel) => mapViewModelToTreeItem(cardSet));
  }

  function sortViewmodelfunction(a: CardSetTreeViewmodel, b: CardSetTreeViewmodel): number {
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
  function mapViewModelToTreeItem(cardSet: CardSetTreeViewmodel): TreeNodeInfo<CardSetTreeViewmodel> {
    const node: TreeNodeInfo<CardSetTreeViewmodel> = {
      id: cardSet.id,
      label: (
        <ContextMenu
          className="tree-view-item"
          content={
            <Menu>
              <MenuItem
                onClick={
                  (e) => {
                    e.preventDefault();
                    synchronizeSet(cardSet.setCode);
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
      isExpanded: cardSet.isExpanded,
      isSelected: cardSet.isSelected,
      nodeData: cardSet
    };
    return node;
  }
  //#endregion
}
