import * as React from "react";
import { RightPanelProps } from "./right-panel.props";

export function RightPanel(props: RightPanelProps) {
  return (
    <>
      Here come card details for card with ID ${props.cardId}
    </>
  );
}
