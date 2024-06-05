import classNames from "classnames";
import * as React from "react";

import { CardTextView } from "../card-text-view/card-text-view";
import { PrintedViewProps } from "./printed-view.props";


export function PrintedView(props: PrintedViewProps) {
  return (
    <>
      <CardTextView cardText={props.cardface.printedText} />
      {
        props.cardface.hasFlavorText &&
        <div>
          <p className={classNames("bp5-divider", "ruling-divider")}></p>
          <p><i>{props.cardface.flavorText}</i></p>
        </div>
      }
    </>
  );
}
