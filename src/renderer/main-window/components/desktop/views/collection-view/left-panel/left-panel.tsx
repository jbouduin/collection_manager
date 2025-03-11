import { ContextMenu, Icon, Menu, MenuDivider, MenuItem, TreeNodeInfo } from "@blueprintjs/core";
import { cloneDeep, isEqual, noop } from "lodash";
import * as React from "react";
import { CollectionDto } from "../../../../../../../common/dto";
import { IpcProxyService, IpcProxyServiceContext } from "../../../../../../shared/context";
import { CollectionTreeViewmodel, TreeConfigurationViewmodel } from "../../../../../viewmodels";
import { BaseTreeView, BaseTreeViewProps } from "../../../../../../shared/components/base/base-tree-view";
import { CollectionDialog } from "./collection-dialog/collection-dialog";
import { DialogData } from "./dialog-data";
import { LeftPanelProps } from "./left-panel.props";
import { SvgProvider } from "../../../../../../shared/components/svg-provider/svg-provider";

const Treeview = React.memo(
  BaseTreeView<CollectionTreeViewmodel, TreeConfigurationViewmodel>,
  (prev: BaseTreeViewProps<CollectionTreeViewmodel, TreeConfigurationViewmodel>, next: BaseTreeViewProps<CollectionTreeViewmodel, TreeConfigurationViewmodel>) => {
    return isEqual(prev.data, next.data) && isEqual(prev.filterProps, next.filterProps);
  }
);

export function LeftPanel(props: LeftPanelProps) {
  //#region State -----------------------------------------------------------
  const initialCollectionState = new Array<CollectionTreeViewmodel>();
  const [collections, setCollections] = React.useState<Array<CollectionTreeViewmodel>>(initialCollectionState);
  const [dialogData, setDialogData] = React.useState<DialogData>(null);
  const [collectionSvg, setCollectionSvg] = React.useState<string>(null);
  //#endregion

  //#region Context -----------------------------------------------------------
  const ipcProxyService = React.useContext<IpcProxyService>(IpcProxyServiceContext);
  //#endregion

  //#region Effects -----------------------------------------------------------
  React.useEffect(
    () => {
      void ipcProxyService
        .getData<Array<CollectionDto>>("/collection")
        .then(
          (result: Array<CollectionDto>) => setCollections(result.map((collection: CollectionDto) => new CollectionTreeViewmodel(collection, false, false))),
          (_r: Error) => setCollections(initialCollectionState)
        );
    },
    []
  );

  React.useEffect(
    () => {
      void ipcProxyService.getData<string>("/asset?path=assets/img/collection.svg")
        .then(
          (response: string) => setCollectionSvg(response),
          (_r: Error) => setCollectionSvg(null)
        );
    },
    []
  );
  //#endregion

  //#region Basetree props ----------------------------------------------------
  function buildTree(data: Array<CollectionTreeViewmodel>, __filterProps: TreeConfigurationViewmodel): Array<TreeNodeInfo<string | CollectionTreeViewmodel>> {
    const treeFromRoot = buildTreeByParentRecursive(data, null);
    return treeFromRoot.length > 0
      ? treeFromRoot[0].childNodes
      : treeFromRoot;
  }
  //#endregion

  //#region Event handling ----------------------------------------------------
  function onSave(collection: CollectionTreeViewmodel): void {
    const savedDtoPromise: Promise<CollectionDto> = dialogData.dialogAction == "edit"
      ? ipcProxyService.putData<CollectionDto, CollectionDto>(`/collection/${collection.id}`, collection.dto)
      : ipcProxyService.postData<CollectionDto, CollectionDto>("/collection", collection.dto);
    void savedDtoPromise.then(
      (savedDto: CollectionDto) => {
        collections.forEach((c: CollectionTreeViewmodel) => c.isSelected = false);
        const newCollectionList = cloneDeep(collections);
        if (dialogData.dialogAction == "edit") {
          const indexOf = newCollectionList.findIndex((coll: CollectionTreeViewmodel) => collection.id == coll.id);
          const savedCollection = new CollectionTreeViewmodel(savedDto, true, newCollectionList[indexOf].isExpanded);
          newCollectionList[indexOf] = savedCollection;
        } else {
          newCollectionList.push(new CollectionTreeViewmodel(savedDto, true, false));
        }
        // expand the parents
        let parentCollection = savedDto.parent_id != null
          ? newCollectionList.find((c: CollectionTreeViewmodel) => c.id == savedDto.parent_id)
          : null;
        while (parentCollection != null) {
          parentCollection.isExpanded = true;
          parentCollection = parentCollection.parentId != null
            ? newCollectionList.find((c: CollectionTreeViewmodel) => c.id == parentCollection.parentId)
            : null;
        }
        setCollections(newCollectionList);
        setDialogData(null);
      },
      noop
    );
  }

  function onCollectionSelected(collections: Array<CollectionTreeViewmodel>): void {
    props.onCollectionSelected(collections);
  }

  function onEdit(collection: CollectionTreeViewmodel): void {
    const newDialogData: DialogData = {
      selectedCollection: collection,
      dialogAction: "edit"
    };
    setDialogData(newDialogData);
  }

  function onAddFolder(parentId: number | null): void {
    if (parentId == null) {
      parentId = collections.find((c: CollectionTreeViewmodel) => c.parentId == null).id;
    }
    const newDto: CollectionDto = {
      id: 0,
      parent_id: parentId,
      name: "",
      description: "",
      is_system: false,
      is_folder: true,
      created_at: undefined,
      modified_at: undefined
    };
    const newDialogData: DialogData = {
      selectedCollection: new CollectionTreeViewmodel(newDto, true, false),
      dialogAction: "create"
    };
    setDialogData(newDialogData);
  }

  function onAddCollection(parentId: number | null): void {
    if (parentId == null) {
      parentId = collections.find((c: CollectionTreeViewmodel) => c.parentId == null).id;
    }
    const newDto: CollectionDto = {
      id: 0,
      parent_id: parentId,
      name: "",
      description: "",
      is_system: false,
      is_folder: false,
      created_at: undefined,
      modified_at: undefined
    };
    const newDialogData: DialogData = {
      selectedCollection: new CollectionTreeViewmodel(newDto, true, false),
      dialogAction: "create"
    };
    setDialogData(newDialogData);
  }

  function onDelete(id: number): void {
    // TODO ask confirmation
    void ipcProxyService.deleteData(`/collection/${id}`)
      .then(
        (numDeletedRows: number) => {
          if (numDeletedRows > 0) {
            const newCollectionList = cloneDeep(collections);
            const indexOf = newCollectionList.findIndex((collection: CollectionTreeViewmodel) => collection.id == id);
            newCollectionList.splice(indexOf, 1);
            /*
             * LATER recursively delete children from list
             * they will not be displayed, as they have no more parent, but they remain in memory
             * and we have a FK restraint on the database (no cascade)
             * which make the option not to allow delete if there are children also legit
             */
            setCollections(newCollectionList);
          }
        },
        noop
      );
  }

  function onCancelDialog(): void {
    setDialogData(null);
  }
  //#endregion

  //#region Rendering ---------------------------------------------------------
  return (
    <>
      <div>
        <ContextMenu
          content={
            <Menu>
              <MenuItem
                key="Add Folder"
                onClick={
                  (e) => {
                    e.preventDefault();
                    onAddFolder(null);
                  }
                }
                text="Add Folder"
              />
              <MenuItem
                key="Add Collection"
                onClick={
                  (e) => {
                    e.preventDefault();
                    onAddCollection(null);
                  }
                }
                text="Add Collection"
              />
            </Menu>
          }
          key="root"
          style={{ height: "100vh" }}
        >
          <Treeview
            buildTree={buildTree}
            data={collections}
            filterProps={undefined}
            onDataSelected={(collections: Array<CollectionTreeViewmodel>) => onCollectionSelected(collections)}
          />
        </ContextMenu>
      </div>
      {
        dialogData &&
        <CollectionDialog
          className={props.className}
          collection={dialogData.selectedCollection}
          collectionSvg={collectionSvg}
          dialogAction={dialogData.dialogAction}
          isOpen={true}
          onCancel={onCancelDialog}
          onSave={(collection: CollectionTreeViewmodel) => void onSave(collection)}
        />
      }
    </>
  );
  //#endregion

  //#region Auxiliary methods -------------------------------------------------
  function buildTreeByParentRecursive(collections: Array<CollectionTreeViewmodel>, id: number | null): Array<TreeNodeInfo<CollectionTreeViewmodel>> {
    return collections
      .filter((item: CollectionTreeViewmodel) => item.parentId === id)
      .sort((a: CollectionTreeViewmodel, b: CollectionTreeViewmodel) => {
        if (a.isFolder && !b.isFolder) {
          return -1;
        } else if (!a.isFolder && b.isFolder) {
          return 1;
        } else {
          return a.name.localeCompare(b.name, undefined, { caseFirst: "false" });
        }
      })
      .map((collection: CollectionTreeViewmodel) => {
        const childNodes: Array<TreeNodeInfo<CollectionTreeViewmodel>> = buildTreeByParentRecursive(collections, collection.id);
        const node = mapViewModelToTreeItem(collection);
        node.childNodes = childNodes.length > 0 ? childNodes : null;
        return node;
      });
  }

  function mapViewModelToTreeItem(collection: CollectionTreeViewmodel): TreeNodeInfo<CollectionTreeViewmodel> {
    const node: TreeNodeInfo<CollectionTreeViewmodel> = {
      id: collection.id,
      label: (
        <ContextMenu
          className="tree-view-item"
          content={
            <Menu key="collection.id">
              <MenuItem
                key="edit"
                onClick={
                  (e) => {
                    e.preventDefault();
                    onEdit(collection);
                  }
                }
                text="Edit"
              />
              {
                collection.isFolder &&
                <>
                  <MenuDivider key="sep-1" />
                  <MenuItem
                    key="Add folder"
                    onClick={
                      (e) => {
                        e.preventDefault();
                        void onAddFolder(collection.id);
                      }
                    }
                    text="Add Folder"
                  />
                  <MenuItem
                    key="Add Collection"
                    onClick={
                      (e) => {
                        e.preventDefault();
                        void onAddCollection(collection.id);
                      }
                    }
                    text="Add Collection"
                  />
                </>
              }
              {
                !collection.isSystem &&
                <>
                  <MenuDivider key="sep-2" />
                  <MenuItem
                    key="Delete"
                    onClick={
                      (e) => {
                        e.preventDefault();
                        void onDelete(collection.id);
                      }
                    }
                    text="Delete"
                  />
                </>
              }
            </Menu>
          }
          key={collection.id}
        >
          {
            collection.isFolder &&
            <Icon icon="folder-close" key="icon" style={{ width: "26px", height: "26px", alignContent: "center", paddingRight: "5px" }} />
          }
          {
            !collection.isFolder &&
            <SvgProvider height={16} svg={collectionSvg} width={16} />
          }

          <div key="name" style={{ alignContent: "center" }}>
            {collection.name}
          </div>
        </ContextMenu>
      ),
      isExpanded: collection.isExpanded,
      isSelected: collection.isSelected,
      nodeData: collection
    };
    return node;
  }
  //#endregion
}
