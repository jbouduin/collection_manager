import * as React from "react";

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { LeftPanelProps } from "./left-panel.props";
import { IpcProxyService, IpcProxyServiceContext } from "../../../../shared/context";
import { DeckCardListDto } from "../../../../../common/dto";
import { noop } from "lodash";
import { LeftPanelTop } from "./left-panel-top/left-panel-top";
import { DeckCardListViewmodel } from "../../../viewmodels";


export function LeftPanel(props: LeftPanelProps) {
  const [cards, setCards] = React.useState<Array<DeckCardListViewmodel>>(new Array<DeckCardListViewmodel>());
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
      <Panel defaultSize={75}>
        <LeftPanelTop
          cards={cards}
          onCardsSelected={(cards: Array<DeckCardListViewmodel>) => props.onCardsSelected(cards)}
        />
      </Panel>
      <PanelResizeHandle />
      <Panel>here comes tabs with deck properties</Panel>
    </PanelGroup>
  );
  //#endregion
}
