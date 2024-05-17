import * as React from "react";
import { CardImageProps } from "./card-image.props";

export function CardImage(props: CardImageProps) {
  // console.log("cardimage constructor", props.card);

  // TODO round the corners, so we do not have the white edges around the card
  //#region Main --------------------------------------------------------------
  return (props.card ?
    <div className="image-wrapper">
      <img className="card-image" src={`cached-image://${props.card.card.id}?size=normal`} />
    </div>
    :
    <div></div>
  );
  //#endregion
}
