import * as React from "react";
import { CardImageViewWrapperProps } from "./card-image-view-wrapper.props";

import { Button, SectionCard } from "@blueprintjs/core";
import classNames from "classnames";
import { CardImageViewWrapperState } from "./card-image-view-wrapper.state";

export function CardImageViewWrapper(props: CardImageViewWrapperProps) {
  // NOW replace rotation class by a number and change onflipclicked to rotate click etc

  //#region State -------------------------------------------------------------
  const [cardImageState, setCardImageState] = React.useState<CardImageViewWrapperState>({currentDisplayedSide: "front", rotationClass:""});
  //#endregion

  //#region Event handling ----------------------------------------------------
  const onFlipClicked = React.useCallback(
    () => {
      const newState: CardImageViewWrapperState = {
        currentDisplayedSide: cardImageState.currentDisplayedSide,
        rotationClass: cardImageState.rotationClass == "" ? "rotate-180" : ""
      };
      setCardImageState(newState);
    },
    [cardImageState, props.card]
  );

  const onReverseClicked = React.useCallback(
    () => {
      const newState: CardImageViewWrapperState = {
        currentDisplayedSide: cardImageState.currentDisplayedSide == "front" ? "back" : "front",
        rotationClass: cardImageState.rotationClass
      };
      setCardImageState(newState);
    },
    [cardImageState, props.card]
  );
  //#endregion

  //#region effect ------------------------------------------------------------
  React.useEffect(
    () => {
      setCardImageState(
        {
          currentDisplayedSide: "front",
          rotationClass: props.card.cardLayout == "split" || props.card.cardLayout == "planar" ? "rotate-90" : ""
        }
      );
    },
    [props.card]
  );
  //#endregion

  //#region Main --------------------------------------------------------------
  return (
    <>
      {
        props.card &&
        <SectionCard style={{ "display": "flex", "flexFlow": "column" }} className="card-view-section-card">
          <img
            className={classNames("card-image", cardImageState.rotationClass)}
            src={`cached-image://${props.card.cardId}/?size=normal&side=${cardImageState.currentDisplayedSide}`}
          />
          <div style={{ "display": "flex", "flexFlow": "row" }}>

            {
              renderButtons()
            }
          </div>
        </SectionCard>
      }
    </>
  );
  //#endregion

  //#region Auxiliary render methods ----------------------------------------------------
  function renderButtons(): Array<React.JSX.Element> {
    const result = new Array<React.JSX.Element>();
    result.push((
      <Button key="reverse" onClick={onReverseClicked}>Reverse</Button>
    ));
    if (props.card.cardLayout == "flip" || props.card.cardLayout == "art_series") {
      result.push((
        <Button key="flip" onClick={onFlipClicked}>Flip</Button>
      ));
    }
    return result;
  }
  //#endregion
}
