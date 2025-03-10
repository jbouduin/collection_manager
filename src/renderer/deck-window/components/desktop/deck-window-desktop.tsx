import React from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { BaseDesktop, DesktopContentProps } from "../../../shared/components/base";
import { DeckWindowDesktopProps } from "./deck-window-desktop.props";
import { LeftPanel } from "./left-panel/left-panel";
import { RightPanel } from "./right-panel/right-panel";
import { DeckCardListViewmodel } from "../../../main-window/viewmodels";

export function DeckWindowDesktop(props: DeckWindowDesktopProps) {
  //#region State -------------------------------------------------------------
  const [selectedCards, setSelectedCards] = React.useState<Array<DeckCardListViewmodel>>(null);
  //#endregion

  //#region rendering ---------------------------------------------------------
  return (
    <BaseDesktop
      desktopContent={(props: DesktopContentProps) => desktopContent(props)}
    />
  );

  function desktopContent(contentProps: DesktopContentProps): React.JSX.Element {
    return (
      <PanelGroup direction="horizontal">
        <Panel defaultSize={80}>
          <LeftPanel
            {...contentProps}
            deckId={props.deckId}
            onCardsSelected={(cards: Array<DeckCardListViewmodel>) => setSelectedCards(cards)}
          />
        </Panel>
        <PanelResizeHandle />
        <Panel>
          <RightPanel cardId={selectedCards?.length > 0 ? selectedCards[0].cardId : null} />
        </Panel>
      </PanelGroup>
    );
  }
  //#endregion
}
