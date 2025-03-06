import { cloneDeep, noop } from "lodash";
import * as React from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { DeckDto, DeckListDto } from "../../../../../../common/dto";
import { DisplayValueService, DisplayValueServiceContext, IpcProxyService, IpcProxyServiceContext } from "../../../../../shared/context";
import { DeckFolderTreeViewmodel, DeckListViewmodel } from "../../../../viewmodels";
import { CenterPanel } from "./center-panel/center-panel";
import { DeckViewProps } from "./deck-view.props";
import { LeftPanel } from "./left-panel/left-panel";
import { RightPanel } from "./right-panel/right.panel";

// TODO memoize child components
export function DeckView(props: DeckViewProps) {
  //#region State -------------------------------------------------------------
  const [selectedDecks, setSelectedDecks] = React.useState<Array<DeckListViewmodel>>(new Array<DeckListViewmodel>());
  const [selectedFolder, setSelectedFolder] = React.useState<number>(null);
  const [decksInFolder, setDecksInFolder] = React.useState<Array<DeckListViewmodel>>(new Array<DeckListViewmodel>());
  //#endregion

  //#region Context -----------------------------------------------------------
  const ipcProxyService = React.useContext<IpcProxyService>(IpcProxyServiceContext);
  //#endregion

  React.useEffect(
    () => {
      if (selectedFolder != null) {
        void ipcProxyService
          .getData<Array<DeckListDto>>(`/deck/folder/${selectedFolder}/deck`)
          .then(
            (r: Array<DeckListDto>) => setDecksInFolder(r.map((deck: DeckListDto) => new DeckListViewmodel(deck))),
            noop
          );
      } else {
        setDecksInFolder(new Array<DeckListViewmodel>());
      }
    },
    [selectedFolder]
  );

  //#region Event handling --------------------------------------------------------------
  const onDeckAdded = React.useCallback(
    (deck: DeckDto) => setDecksInFolder((oldDecksInFolder: Array<DeckListViewmodel>) => {
      const newDeckList = cloneDeep(oldDecksInFolder);
      const newListDto: DeckListDto = {
        ...deck,
        calculatedFormats: [],
        deckSize: 0,
        sideBoardSize: 0
      };
      newDeckList.push(new DeckListViewmodel(newListDto));
      return newDeckList;
    }),
    [decksInFolder]
  );

  const onDeleteDeck = React.useCallback(
    (deck: DeckListViewmodel) => {
      void ipcProxyService.deleteData(`/deck/${deck.id}`)
        .then(
          (deletedRows: number) => {
            if (deletedRows > 0) {
              setDecksInFolder((oldDecksInFolder: Array<DeckListViewmodel>) => {
                const indexOf = oldDecksInFolder.findIndex((d: DeckListViewmodel) => d.id == deck.id);
                if (indexOf >= 0) {
                  const newState = cloneDeep(oldDecksInFolder);
                  newState.splice(indexOf, 1);
                  return newState;
                }
              });
            }
          },
          noop
        );
    },
    [decksInFolder]
  );

  const onEditDeck = React.useCallback(
    (deck: DeckListViewmodel) => {
      void ipcProxyService
        .getData(`/window/deck/${deck.id}`)
        .then(noop, noop);
    },
    []
  );
  //#endregion

  //#region Rendering ---------------------------------------------------------
  return (
    <DisplayValueServiceContext.Consumer>
      {
        (displayServiceValueService: DisplayValueService) => (
          <PanelGroup direction="horizontal">
            <Panel defaultSize={20}>
              <LeftPanel
                {...props}
                onDeckAdded={(deck: DeckDto) => onDeckAdded(deck)}
                onFolderSelected={(folder: DeckFolderTreeViewmodel) => setSelectedFolder(folder.id)}
              />
            </Panel>
            <PanelResizeHandle />
            <Panel>
              <CenterPanel
                {...props}
                decks={decksInFolder}
                displayServiceValueService={displayServiceValueService}
                onDecksSelected={(decks: Array<DeckListViewmodel>) => setSelectedDecks(decks)}
                onDeleteDeck={(deck: DeckListViewmodel) => onDeleteDeck(deck)}
                onEditDeck={(deck: DeckListViewmodel) => onEditDeck(deck)}
              />
            </Panel>
            <PanelResizeHandle />
            <Panel defaultSize={20}>
              <RightPanel selectedDeckId={selectedDecks.length > 0 ? selectedDecks[0].id : undefined} />
            </Panel>
          </PanelGroup>
        )
      }
    </DisplayValueServiceContext.Consumer>
  );
  //#endregion
}
