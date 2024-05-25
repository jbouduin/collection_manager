import * as React from "react";

import { OraclePanelProps } from "./oracle-panel.props";
import { CardText } from "../card-text/card-text";

export function OraclePanel(props: OraclePanelProps) {
  return (
    <CardText cardText={props.card.oracleText} />
  );
}
