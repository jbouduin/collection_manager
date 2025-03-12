import { cloneDeep, noop } from "lodash";
import * as React from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { DeckCardListDto, UpdateDeckCardQuantityDto } from "../../../../../common/dto";
import { IpcProxyService, IpcProxyServiceContext } from "../../../../shared/context";
import { DeckContentType } from "../../../types";
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

  //#region Event handling ----------------------------------------------------
  function onCardDecrease(card: DeckCardListViewmodel, content: DeckContentType): void {
    const dto: UpdateDeckCardQuantityDto = {
      deck_card_id: card.deckCardId,
      deck_quantity: content == "deck" ? card.deckQuantity - 1 : card.deckQuantity,
      sideboard_quantity: content == "deck" ? card.sideboardQuantity : card.sideboardQuantity - 1
    };
    updateQuantity(dto);
  }

  function onCardIncrease(card: DeckCardListViewmodel, content: DeckContentType): void {
    const dto: UpdateDeckCardQuantityDto = {
      deck_card_id: card.deckCardId,
      deck_quantity: content == "deck" ? card.deckQuantity + 1 : card.deckQuantity,
      sideboard_quantity: content == "deck" ? card.sideboardQuantity : card.sideboardQuantity + 1
    };
    updateQuantity(dto);
  }

  function updateQuantity(dto: UpdateDeckCardQuantityDto): void {
    void ipcProxyService
      .patchData<UpdateDeckCardQuantityDto, DeckCardListDto>(`/deck-card/${dto.deck_card_id}/quantity`, dto)
      .then(
        (r: DeckCardListDto) => {
          const newCards = cloneDeep(cards);
          const indexOf = newCards.findIndex((c: DeckCardListViewmodel) => c.deckCardId == dto.deck_card_id);
          newCards[indexOf] = new DeckCardListViewmodel(r);
          setCards(newCards);
        },
        noop
      );
  }

  function onCardRemove(card: DeckCardListViewmodel, content: DeckContentType): void {
    const dto: UpdateDeckCardQuantityDto = {
      deck_card_id: card.deckCardId,
      deck_quantity: content == "deck" ? 0 : card.deckQuantity,
      sideboard_quantity: content == "deck" ? card.sideboardQuantity : 0
    };
    if (dto.deck_quantity + dto.sideboard_quantity == 0) {
      void ipcProxyService
        .deleteData(`/deck-card/${card.deckCardId}`)
        .then(
          (deletedRows: number) => {
            if (deletedRows > 0) {
              const newCards = cloneDeep(cards);
              const indexOf = newCards.findIndex((c: DeckCardListViewmodel) => c.deckCardId == card.deckCardId);
              newCards.splice(indexOf, 1);
              setCards(newCards);
            }
          },
          noop
        );
    } else {
      updateQuantity(dto);
    }
  }
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
            onCardDecrease={(card: DeckCardListViewmodel) => onCardDecrease(card, "deck")}
            onCardIncrease={(card: DeckCardListViewmodel) => onCardIncrease(card, "deck")}
            onCardRemove={(card: DeckCardListViewmodel) => onCardRemove(card, "deck")}
            onCardsSelected={(cards: Array<DeckCardListViewmodel>) => props.onCardsSelected(cards)}
            onToggleCollaps={() => setDeckIsOpen(!deckIsOpen)}
          />
          <CardTableSection
            cards={cards.filter((c: DeckCardListViewmodel) => c.sideboardQuantity > 0)}
            content="sideboard"
            isOpen={!deckIsOpen}
            onCardDecrease={(card: DeckCardListViewmodel) => onCardDecrease(card, "sideboard")}
            onCardIncrease={(card: DeckCardListViewmodel) => onCardIncrease(card, "sideboard")}
            onCardRemove={(card: DeckCardListViewmodel) => onCardRemove(card, "sideboard")}
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
