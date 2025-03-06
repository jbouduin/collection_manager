import * as React from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { LeftPanelProps } from "./left-panel.props";

export function LeftPanel(props: LeftPanelProps) {
  return (
    <PanelGroup direction="vertical">
      <Panel defaultSize={75}>here comes the table with cards for the deck with ID ${props.deckId}</Panel>
      <PanelResizeHandle />
      <Panel>here comes tabs with deck properties</Panel>
    </PanelGroup>
  );
}
