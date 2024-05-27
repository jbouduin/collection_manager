import { SectionCard } from "@blueprintjs/core";
import * as React from "react";

import { CardImageViewProps } from "./card-image-view.props";
import classNames from "classnames";

export function CardImageView(props: CardImageViewProps) {

  // TODO round the corners, so we do not have the white edges around the card
  //#region Main --------------------------------------------------------------
  return (props.cardface ?
    <SectionCard padded={true} className={props.className}>
      <img
        className={classNames("card-image", props.layout == "split" ? "rotate-90" : "")}
        src={`cached-image://${props.cardface.cardId}/?size=normal&sequence=${props.cardface.sequence}`} />
    </SectionCard>
    :
    <div></div>
  );
  //#endregion
}
