import * as React from "react";
import classNames from "classnames";

import { PrintedPanelProps } from "./printed-panel.props";

export function PrintedPanel(props: PrintedPanelProps) {
  return (
    <div>
      <p >{props.card.printedText}</p>
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
