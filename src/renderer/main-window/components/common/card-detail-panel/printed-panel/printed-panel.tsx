import * as React from "react";
import classNames from "classnames";

import { PrintedPanelProps } from "./printed-panel.props";
import { CardText } from "../card-text/card-text";

export function PrintedPanel(props: PrintedPanelProps) {
  return (
    <div>
      <CardText cardText={props.card.printedText}/>
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
