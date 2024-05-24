import * as React from "react";

import { OracleProps } from "./oracle.props";
import classNames from "classnames";

export function Oracle(props: OracleProps) {
  return (
    <div>
      <p >{props.card.oracleText}</p>
      {
        props.card.hasFlavorText &&
        <div>
          <p className={classNames(props.className, "bp5-divider")}></p>
          <p><i>{props.card.flavorText}</i></p>
          <p className={classNames(props.className, "bp5-divider")}></p>
        </div>
      }
    </div>
  );
}
