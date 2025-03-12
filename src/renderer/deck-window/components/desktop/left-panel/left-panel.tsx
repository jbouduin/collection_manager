import { noop } from "lodash";
import * as React from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { DeckCardListDto } from "../../../../../common/dto";
import { IpcProxyService, IpcProxyServiceContext } from "../../../../shared/context";
import { DeckCardListViewmodel } from "../../../viewmodels";
import { CardTableSection } from "./card-table-section/card-table-section";
import { LeftPanelProps } from "./left-panel.props";


export function LeftPanel(props: LeftPanelProps) {
  //#region State -------------------------------------------------------------
  const [cards, setCards] = React.useState<Array<DeckCardListViewmodel>>(new Array<DeckCardListViewmodel>());
  const [deckIsOpen, setDeckIsOpen] = React.useState<boolean>(true);
  //#endregion

  //#region Context -----------------------------------------------------------
  const ipcProxyService = React.useContext<IpcProxyService>(IpcProxyServiceContext);
  //#endregion

  //#region Effect ------------------------------------------------------------
  React.useEffect(
    () => void ipcProxyService
      .getData<Array<DeckCardListDto>>(`/deck/${props.deckId}/card`)
      .then(
        (r: Array<DeckCardListDto>) => setCards(r.map((d: DeckCardListDto) => new DeckCardListViewmodel(d))),
        noop
      ),
    [props.deckId]
  );
  //#endregion

  //#region Rendering ---------------------------------------------------------
  return (
    <PanelGroup direction="vertical">
      <Panel defaultSize={70}>
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <CardTableSection
            cards={cards.filter((c: DeckCardListViewmodel) => c.deckQuantity > 0)}
            content="deck"
            isOpen={deckIsOpen}
            onCardsSelected={(cards: Array<DeckCardListViewmodel>) => props.onCardsSelected(cards)}
            onToggleCollaps={() => setDeckIsOpen(!deckIsOpen)}
          />
          <CardTableSection
            cards={cards.filter((c: DeckCardListViewmodel) => c.sideboardQuantity > 0)}
            content="sideboard"
            isOpen={!deckIsOpen}
            onCardsSelected={(cards: Array<DeckCardListViewmodel>) => props.onCardsSelected(cards)}
            onToggleCollaps={() => setDeckIsOpen(!deckIsOpen)}
          />
        </div>
      </Panel>
      <PanelResizeHandle />
      <Panel>here comes tabs with deck properties</Panel>
    </PanelGroup>
  );
  //#endregion
}
