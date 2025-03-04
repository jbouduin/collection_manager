import * as React from "react";
import { RightPanelProps } from "./right-panel.props";
import { H2, H3 } from "@blueprintjs/core";

export function RightPanel(props: RightPanelProps) {
  return (
    <>
    {
      props.selectedDeckId != undefined &&
        <H2>{props.selectedDeckId}</H2>
      }
      {
        props.selectedDeckId == undefined &&
        <H3>Select a deck to view details</H3>
      }
    </>
  )
}
