import * as React from "react";

import { CardTextView } from "../card-text-view/card-text-view";
import { OracleViewProps } from "./oracle-view.props";

// remove this one ? unless more data will come
export function OracleView(props: OracleViewProps) {
  //#region Main --------------------------------------------------------------
  return (
    <CardTextView cardText={props.oracle.oracleText}/>
  );
  //#endregion
}
