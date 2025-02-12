import { TreeNodeInfo } from "@blueprintjs/core";
import { cloneDeep } from "lodash";
import * as React from "react";

import { DtoCollection } from "../../../../../../../common/dto";
import { QueryParam } from "../../../../../../../common/ipc-params";
import { BaseTreeView } from "../../../../../components/common/base-tree-view/base-tree-view";
import { CollectionViewmodel } from "../../../../../viewmodels/collection/collection.viewmodel";
import { TreeConfigurationViewmodel } from "../../../../../viewmodels/database-view/tree-configuration.viewmodel";
import { CollectionDialog } from "./collection-dialog/collection-dialog";
import { HeaderView } from "./header-view/header-view";
import { LeftPanelProps } from "./left-panel.props";
import { DialogData } from "./dialog-data";



export function LeftPanel(props: LeftPanelProps) {

  console.log("in function LeftPanel");
  const [collections, setCollections] = React.useState<Array<CollectionViewmodel>>(new Array<CollectionViewmodel>());
  // const [dialogIsOpen, setDialogIsOpen] = React.useState(false);
  // const [selectedCollection, setSelectedCollection] = React.useState<CollectionViewmodel>(undefined);
  // const [previousSelectedCollection, setPreviousSelectedCollection] = React.useState<CollectionViewmodel>(undefined);
  const [dialogData, setDialogData] = React.useState<DialogData>({
    selectedCollection: undefined,
    previousSelectedCollection: undefined,
    dialogIsOpen: false,
    dialogAction: "none"
  });

  React.useEffect(
    () => {
      const queryCollections: QueryParam<null> = {
        type: "Collection",
        options: null
      };
      console.log("querying backend");
      window.ipc.query(queryCollections)
        .then((result: Array<DtoCollection>) => setCollections(result.map((collection: DtoCollection) => new CollectionViewmodel(collection))));
    },
    [props]
  )

  function applyFilterProps(data: Array<CollectionViewmodel>, _filterProps: TreeConfigurationViewmodel): Array<CollectionViewmodel> {
    return data;
  }

  function buildTree(data: CollectionViewmodel[], __filterProps: TreeConfigurationViewmodel): TreeNodeInfo<string | CollectionViewmodel>[] {
    return buildTreeByParentRecursive(data, null);
  }

  //#region Event handling ----------------------------------------------------
  function onSave(collection: CollectionViewmodel): void {
    // TODO call backend to save changes or create new collection
    const savedCollection = collection;
    const newCollectionList = cloneDeep(collections);
    if (dialogData.dialogAction == "edit") {
      const indexOf = newCollectionList.findIndex((coll: CollectionViewmodel) => collection.id == coll.id);
      newCollectionList[indexOf] = savedCollection;
    } else {
      newCollectionList.push(savedCollection);
    }
    const newDialogData = cloneDeep(dialogData);
    newDialogData.dialogIsOpen = false;
    setCollections(newCollectionList);
    setDialogData(newDialogData);
    // TODO make sure the modifed collection is updated and the if it was a create make it selected
  }

  function onCollectionSelected(collections: Array<CollectionViewmodel>): void {
    const newDialogData = cloneDeep(dialogData);
    newDialogData.selectedCollection = collections[0];
    setDialogData(newDialogData);
    props.onCollectionSelected(collections);
  }

  function onEdit(): void {
    const newDialogData = cloneDeep(dialogData);
    newDialogData.previousSelectedCollection = cloneDeep(dialogData.selectedCollection);
    newDialogData.dialogIsOpen = true;
    newDialogData.dialogAction = "edit";
    setDialogData(newDialogData);
  }

  function onAddFolder(): void {
    const newDto: DtoCollection = {
      id: 0,
      parent_id: dialogData.selectedCollection.id,
      name: "",
      description: "",
      is_system: false,
      is_folder: true,
      created_at: undefined,
      modified_at: undefined
    };
    const newDialogData: DialogData = {
      selectedCollection: new CollectionViewmodel(newDto),
      previousSelectedCollection: dialogData.selectedCollection,
      dialogIsOpen: true,
      dialogAction: "create"
    };
    setDialogData(newDialogData);
  }

  function onAddCollection(): void {
    const newDto: DtoCollection = {
      id: 0,
      parent_id: dialogData.selectedCollection.id,
      name: "",
      description: "",
      is_system: false,
      is_folder: false,
      created_at: undefined,
      modified_at: undefined
    };
    const newDialogData: DialogData = {
      selectedCollection: new CollectionViewmodel(newDto),
      previousSelectedCollection: dialogData.selectedCollection,
      dialogIsOpen: true,
      dialogAction: "create"
    };
    setDialogData(newDialogData);
  }

  function onDelete(): void {
    if (dialogData.selectedCollection && !dialogData.selectedCollection.isSystem) {
      // TODO confirmation dialog
      // TODO call backend to delete
      const newCollectionList = cloneDeep(collections);
      const indexOf = newCollectionList.findIndex((collection: CollectionViewmodel) => collection.id == dialogData.selectedCollection.id);
      newCollectionList.splice(indexOf, 1);
      setCollections(newCollectionList);
    }
  }

  function onCancelDialog(): void {
    dialogData.selectedCollection.cancelChanges();
    const newDialogData = cloneDeep(dialogData);
    newDialogData.dialogIsOpen = false;
    setDialogData(newDialogData);
  }
  //#endregion

  //#region Main --------------------------------------------------------------
  return (
    <>
      <div className="card-set-tree-wrapper">
        <HeaderView
          canAddCollection={dialogData.selectedCollection ? dialogData.selectedCollection.isFolder : false}
          canAddFolder={dialogData.selectedCollection ? dialogData.selectedCollection.isFolder : false}
          canDelete={dialogData.selectedCollection ? !dialogData.selectedCollection.isSystem : false}
          canEdit={dialogData.selectedCollection ? true : false}
          onDelete={onDelete}
          onAddCollection={onAddCollection}
          onAddFolder={onAddFolder}
          onEdit={onEdit}
        />
        <BaseTreeView<CollectionViewmodel, TreeConfigurationViewmodel>
          data={collections}
          onDataSelected={onCollectionSelected}
          filterProps={undefined}
          applyFilterProps={applyFilterProps}
          buildTree={buildTree}
        />
      </div>
      <CollectionDialog
        dialogAction={dialogData.dialogAction}
        collection={dialogData.selectedCollection}
        isOpen={dialogData.dialogIsOpen}
        onSave={onSave}
        onCancel={onCancelDialog}
      ></CollectionDialog>
    </>
  );
  //#endregion

  function buildTreeByParentRecursive(collections: Array<CollectionViewmodel>, id: number | null): Array<TreeNodeInfo<CollectionViewmodel>> {
    return collections
      .filter((item: CollectionViewmodel) => item.parentId === id)
      .sort((a: CollectionViewmodel, b: CollectionViewmodel) => a.name.localeCompare(b.name))
      .map((collection: CollectionViewmodel) => {
        const childNodes: Array<TreeNodeInfo<CollectionViewmodel>> = buildTreeByParentRecursive(collections, collection.id);
        const node = mapViewModelToTreeItem(collection);
        node.childNodes = childNodes.length > 0 ? childNodes : null;
        return node;
      });
  }

  function mapViewModelToTreeItem(collection: CollectionViewmodel): TreeNodeInfo<CollectionViewmodel> {
    const node: TreeNodeInfo<CollectionViewmodel> = {
      id: collection.id,
      label: collection.name,
      isExpanded: false,
      isSelected: false,
      nodeData: collection
    };
    return node;
  }
}
