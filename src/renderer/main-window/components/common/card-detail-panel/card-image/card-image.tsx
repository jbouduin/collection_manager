import { SectionCard } from "@blueprintjs/core";
import * as React from "react";

import { CardImageProps } from "./card-image.props";
import classNames from "classnames";

export function CardImage(props: CardImageProps) {
  console.log("cardimage constructor", props.card);

  // TODO round the corners, so we do not have the white edges around the card
  //#region Main --------------------------------------------------------------
  return (props.card ?
    <SectionCard padded={true} className={props.className}>
      <img className={classNames("card-image", props.card.cardLayout == "split" ? "split-card" : "")} src={`cached-image://${props.card.cardfaceId}/?size=normal&sequence=0`} />
    </SectionCard>
    :
    <div></div>
  );
  //#endregion
}
