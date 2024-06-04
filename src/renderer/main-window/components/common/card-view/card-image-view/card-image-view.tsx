import { SectionCard } from "@blueprintjs/core";
import * as React from "react";

import { CardImageViewProps } from "./card-image-view.props";
import classNames from "classnames";

export function CardImageView(props: CardImageViewProps) {

  // TODO round the corners, so we do not have the white edges around the card
  //#region Main --------------------------------------------------------------
  return (props.cardId ?
    <SectionCard className="card-view-section-card">
      {
        render()
      }
    </SectionCard>
    :
    <div></div>
  );
  //#endregion

  //#region Auxiliary methods -------------------------------------------------
  function render(): React.JSX.Element {
    if (props.onFlipClicked) {
      return (
        <img
          onClick={props.onFlipClicked}
          className={classNames("card-image", props.rotationClass)}
          src={`cached-image://${props.cardId}/?size=normal&sequence=${props.cardfaceSequence}`}
        />
      );
    } else if (props.onReverseClicked) {
      return (
        <img
          onClick={props.onReverseClicked}
          className={classNames("card-image", props.rotationClass)}
          src={`cached-image://${props.cardId}/?size=normal&sequence=${props.cardfaceSequence}`}
        />
      );
    } else {
      return (
        <img
          className={classNames("card-image", props.rotationClass)}
          src={`cached-image://${props.cardId}/?size=normal&sequence=${props.cardfaceSequence}`}
        />
      );
    }
  }
  //#endregion
}
