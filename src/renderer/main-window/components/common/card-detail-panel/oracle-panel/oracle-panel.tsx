import * as React from "react";

import { OraclePanelProps } from "./oracle-panel.props";

export function OraclePanel(props: OraclePanelProps) {
  return (
    <p >{props.card.oracleText}</p>
  );
}
