import * as React from "react";

import { CardTextProps } from "./card-text.props";


export function CardText(props: CardTextProps) {
  //#region Main --------------------------------------------------------------
  return (
    <div>
      {props.cardText.replace(/\r\n/g, "\r").replace(/\n/g, "\r").split(/\r/).map((t: string) => <p>{t}</p>)}
    </div>
  );
  //#endregion
}
