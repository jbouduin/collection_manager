import { Classes } from "@blueprintjs/core";
import classNames from "classnames";
import * as React from "react";

import { RulingLineProps } from "./ruling.line.props";

export function RulingLine(props: RulingLineProps) {
  return (
    <div>
      <p>{new Date(props.ruling.published_at).toLocaleDateString(navigator.language, { day: "2-digit", month: "2-digit", year: "numeric" })} - {props.ruling.source}</p>
      <p className={classNames(props.className, Classes.RUNNING_TEXT)}>{props.ruling.comments}</p>
      {
        !props.isLast &&
        <p className={classNames(props.className, "bp5-divider")}></p>
      }
    </div>
  );
}
