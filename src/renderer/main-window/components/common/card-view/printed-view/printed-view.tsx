import classNames from "classnames";
import * as React from "react";

import { CardTextView } from "../card-text-view/card-text-view";
import { PrintedViewProps } from "./printed-view.props";

export function PrintedView(props: PrintedViewProps) {
  return (
    <div>
      <CardTextView cardText={props.cardface.printedText} symbolSvgs={props.symbolSvgs}/>
      {
        props.cardface.hasFlavorText &&
        <div>
          <p className={classNames(props.className, "bp5-divider")}></p>
          <p><i>{props.cardface.flavorText}</i></p>
          <p className={classNames(props.className, "bp5-divider")}></p>
        </div>
      }
    </div>
  );
}
