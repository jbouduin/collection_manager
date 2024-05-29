import { Classes } from "@blueprintjs/core";
import classNames from "classnames";
import * as React from "react";

import { RulingLineViewProps } from "./ruling-line-view.props";

export function RulingLineView(props: RulingLineViewProps) {
  //#region Main ----------------------------------------------------
  return (
    <div>
      <p>{new Date(props.ruling.published_at).toLocaleDateString(navigator.language, { day: "2-digit", month: "2-digit", year: "numeric" })} - {props.ruling.source}</p>
      <p className={Classes.RUNNING_TEXT}>{props.ruling.comments}</p>
      {
        !props.isLast &&
        <p className={classNames("bp5-divider", "ruling-divider")}></p>
      }
    </div>
  );
  //#endregion
}
