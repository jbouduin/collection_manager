import React from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { BaseDesktop, DesktopContentProps } from "../../../shared/components/base";
import { DeckWindowDesktopProps } from "./deck-window-desktop.props";
import { LeftPanel } from "./left-panel/left-panel";
import { RightPanel } from "./right-panel/right-panel";

export function DeckWindowDesktop(props: DeckWindowDesktopProps) {
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
          />
        </Panel>
        <PanelResizeHandle />
        <Panel>
          <RightPanel cardId={null} />
        </Panel>
      </PanelGroup>
    );
  }
  //#endregion
}
