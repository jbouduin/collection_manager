import { ContextMenu, Icon, Menu, MenuDivider, MenuItem, TreeNodeInfo } from "@blueprintjs/core";
import { cloneDeep, noop } from "lodash";
import * as React from "react";
import { DeckDto, DeckFolderDto } from "../../../../../../../common/dto";
import { BaseTreeView } from "../../../../../../shared/components/base-tree-view";
import { IpcProxyService, IpcProxyServiceContext } from "../../../../../../shared/context";
import { DeckFolderTreeViewmodel, DeckViewmodel, TreeConfigurationViewmodel } from "../../../../../viewmodels";
import { DeckDialog } from "./deck-dialog/deck-dialog";
import { DialogData } from "./dialog-data";
import { LeftPanelProps } from "./left-panel.props";


export function LeftPanel(props: LeftPanelProps) {
  //#region State -----------------------------------------------------------
  const initialCollectionState = new Array<DeckFolderTreeViewmodel>();
  const [folderDecks, setFolderDecks] = React.useState<Array<DeckFolderTreeViewmodel>>(initialCollectionState);
  const [dialogData, setDialogData] = React.useState<DialogData>(null);
  const [deckSvg, setDeckSvg] = React.useState<string>(null);
  //#endregion

  //#region Context -----------------------------------------------------------
  const ipcProxyService = React.useContext<IpcProxyService>(IpcProxyServiceContext);
  //#endregion

  //#region Effects -----------------------------------------------------------
  React.useEffect(
    () => {
      void ipcProxyService
        .getData<Array<DeckFolderDto>>("/deck/folder")
        .then(
          (result: Array<DeckFolderDto>) => setFolderDecks(result.map((collection: DeckFolderDto) => new DeckFolderTreeViewmodel(collection, false, false))),
          (_r: Error) => setFolderDecks(initialCollectionState)
        );
    },
    []
  );

  React.useEffect(
    () => {
      void ipcProxyService.getData<string>("/asset?path=assets/img/deck.svg")
        .then(
          (response: string) => setDeckSvg(response),
          (_r: Error) => setDeckSvg(null)
        );
    },
    []
  );
  //#endregion

  //#region Basetree props ----------------------------------------------------
  function buildTree(data: Array<DeckFolderTreeViewmodel>, _filterProps: TreeConfigurationViewmodel): Array<TreeNodeInfo<string | DeckFolderTreeViewmodel>> {
    const treeFromRoot = buildTreeByParentRecursive(data, null);
    return treeFromRoot.length > 0
      ? treeFromRoot[0].childNodes
      : treeFromRoot;
  }
  //#endregion

  //#region Event handling ----------------------------------------------------
  function onSave(deck: DeckViewmodel): void {
    const savedDtoPromise: Promise<DeckDto> = dialogData.dialogAction == "edit"
      ? ipcProxyService.patchData<DeckDto, DeckDto>(`/deck/${deck.id}`, deck.dto)
      : ipcProxyService.postData<DeckDto, DeckDto>("/deck", deck.dto);
    void savedDtoPromise.then(
      (savedDto: DeckDto) => {
        if (savedDto.is_folder) {
          folderDecks.forEach((c: DeckFolderTreeViewmodel) => c.isSelected = false);
          const newFolderList = cloneDeep(folderDecks);
          if (dialogData.dialogAction == "edit") {
            const indexOf = newFolderList.findIndex((folder: DeckFolderTreeViewmodel) => deck.id == folder.id);
            const savedFolder = new DeckFolderTreeViewmodel(savedDto, true, newFolderList[indexOf].isExpanded);
            newFolderList[indexOf] = savedFolder;
          } else {
            newFolderList.push(new DeckFolderTreeViewmodel(savedDto, true, false));
          }
          // expand the parents
          let parentFolder = savedDto.parent_id != null
            ? newFolderList.find((c: DeckFolderTreeViewmodel) => c.id == savedDto.parent_id)
            : null;
          while (parentFolder != null) {
            parentFolder.isExpanded = true;
            parentFolder = parentFolder.parentId != null
              ? newFolderList.find((c: DeckFolderTreeViewmodel) => c.id == parentFolder.parentId)
              : null;
          }
          setFolderDecks(newFolderList);
        } else {
          props.onDeckAdded(savedDto);
        }
        setDialogData(null);
      },
      noop
    );
  }

  function onEdit(deck: DeckFolderTreeViewmodel): void {
    const newDialogData: DialogData = {
      selectedDeck: new DeckViewmodel(deck.dto),
      dialogAction: "edit"
    };
    setDialogData(newDialogData);
  }

  function onAddFolder(parentId: number | null): void {
    if (parentId == null) {
      parentId = folderDecks.find((c: DeckFolderTreeViewmodel) => c.parentId == null).id;
    }
    const newDto: DeckDto = {
      id: 0,
      parent_id: parentId,
      name: "",
      description: "",
      is_system: false,
      is_folder: true,
      target_format: null,
      created_at: undefined,
      modified_at: undefined
    };
    const newDialogData: DialogData = {
      selectedDeck: new DeckViewmodel(newDto),
      dialogAction: "create"
    };
    setDialogData(newDialogData);
  }

  function onAddDeck(parentId: number): void {
    const newDto: DeckDto = {
      id: 0,
      parent_id: parentId,
      name: "",
      description: "",
      is_system: false,
      is_folder: false,
      target_format: null,
      created_at: undefined,
      modified_at: undefined
    };
    const newDialogData: DialogData = {
      selectedDeck: new DeckViewmodel(newDto),
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
            const newCollectionList = cloneDeep(folderDecks);
            const indexOf = newCollectionList.findIndex((deck: DeckFolderTreeViewmodel) => deck.id == id);
            newCollectionList.splice(indexOf, 1);
            /*
             * LATER recursively delete children from list
             * they will not be displayed, as they have no more parent, but they remain in memory
             * and we have a FK restraint on the database (no cascade)
             * which make the option not to allow delete if there are children also legit
             */
            setFolderDecks(newCollectionList);
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
                key="add-root-folder"
                onClick={
                  (e) => {
                    e.preventDefault();
                    onAddFolder(null);
                  }
                }
                text="Add Folder"
              />
            </Menu>
          }
          key="root"
          style={{ height: "100vh" }}
        >
          <BaseTreeView<DeckFolderTreeViewmodel, TreeConfigurationViewmodel>
            buildTree={buildTree}
            data={folderDecks}
            filterProps={undefined}
            onDataSelected={(selectedFolders: Array<DeckFolderTreeViewmodel>) => props.onFolderSelected(selectedFolders?.length > 0 ? selectedFolders[0] : null)}
          />
        </ContextMenu>
      </div>
      {
        dialogData &&
        <DeckDialog
          className={props.className}
          deck={dialogData.selectedDeck}
          deckSvg={deckSvg}
          dialogAction={dialogData.dialogAction}
          isOpen={true}
          onCancel={onCancelDialog}
          onSave={(deck: DeckViewmodel) => onSave(deck)}
        />
      }
    </>
  );
  //#endregion

  //#region Auxiliary methods -------------------------------------------------
  function buildTreeByParentRecursive(decks: Array<DeckFolderTreeViewmodel>, id: number | null): Array<TreeNodeInfo<DeckFolderTreeViewmodel>> {
    return decks
      .filter((item: DeckFolderTreeViewmodel) => item.parentId === id)
      .sort((a: DeckFolderTreeViewmodel, b: DeckFolderTreeViewmodel) => a.name.localeCompare(b.name, undefined, { caseFirst: "false" }))
      .map((collection: DeckFolderTreeViewmodel) => {
        const childNodes: Array<TreeNodeInfo<DeckFolderTreeViewmodel>> = buildTreeByParentRecursive(decks, collection.id);
        const node = mapViewModelToTreeItem(collection);
        node.childNodes = childNodes.length > 0 ? childNodes : null;
        return node;
      });
  }

  function mapViewModelToTreeItem(deck: DeckFolderTreeViewmodel): TreeNodeInfo<DeckFolderTreeViewmodel> {
    const node: TreeNodeInfo<DeckFolderTreeViewmodel> = {
      id: deck.id,
      label: (
        <ContextMenu
          className="set-tree-item"
          content={
            <Menu key={deck.id}>
              <MenuItem
                key="edit"
                onClick={
                  (e) => {
                    e.preventDefault();
                    onEdit(deck);
                  }
                }
                text="Edit"
              />
              <MenuDivider key="sep-1" />
              <MenuItem
                key="add-folder"
                onClick={
                  (e) => {
                    e.preventDefault();
                    void onAddFolder(deck.id);
                  }
                }
                text="Add Folder"
              />
              <MenuItem
                key="add-deck"
                onClick={
                  (e) => {
                    e.preventDefault();
                    void onAddDeck(deck.id);
                  }
                }
                text="Add Deck"
              />
              {
                !deck.isSystem &&
                <>
                  <MenuDivider key="sep-2" />
                  <MenuItem
                    key="Delete"
                    onClick={
                      (e) => {
                        e.preventDefault();
                        void onDelete(deck.id);
                      }
                    }
                    text="Delete"
                  />
                </>
              }
            </Menu>
          }
          key={deck.id}
        >
          <Icon icon="folder-close" key="icon" style={{ width: "26px", height: "26px", alignContent: "center", paddingRight: "5px" }} />
          <div key="name" style={{ alignContent: "center" }}>
            {deck.name}
          </div>
        </ContextMenu>
      ),
      isExpanded: deck.isExpanded,
      isSelected: deck.isSelected,
      nodeData: deck
    };
    return node;
  }
  //#endregion
}
