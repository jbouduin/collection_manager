import { Button, SectionCard } from "@blueprintjs/core";
import classNames from "classnames";
import * as React from "react";
import { CardImageViewProps } from "./card-image-view.props";
import { CardImageViewState } from "./card-image-view.state";


export function CardImageView(props: CardImageViewProps) {
  //#region State -------------------------------------------------------------
  const [cardImageState, setCardImageState] = React.useState<CardImageViewState>({ currentDisplayedSide: "front", rotationClass: "" });
  //#endregion

  //#region Event handling ----------------------------------------------------
  const onFlipClicked = React.useCallback(
    () => {
      const newState: CardImageViewState = {
        currentDisplayedSide: cardImageState.currentDisplayedSide,
        rotationClass: cardImageState.rotationClass == "" ? "rotate-180" : ""
      };
      setCardImageState(newState);
    },
    [cardImageState, props.card]
  );

  const onRotateClicked = React.useCallback(
    () => {
      const newState: CardImageViewState = {
        currentDisplayedSide: cardImageState.currentDisplayedSide,
        rotationClass: cardImageState.rotationClass == "" ? "rotate-90" : ""
      };
      setCardImageState(newState);
    },
    [cardImageState, props.card]
  );

  const onReverseClicked = React.useCallback(
    () => {
      const newState: CardImageViewState = {
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
      setCardImageState({
        currentDisplayedSide: "front",
        rotationClass: props.card.cardLayout == "split" || props.card.cardLayout == "planar" ? "rotate-90" : ""
      });
    },
    [props.card]
  );
  //#endregion

  //#region Rendering ---------------------------------------------------------
  return (
    <>
      {
        props.card &&
        <SectionCard className="card-view-section-card" padded={false} style={{ display: "flex", flexFlow: "column" }} >
          <img
            className={classNames(cardImageState.rotationClass == "rotate-90" ? "card-image-landscape" : "card-image-portrait", "card-image", cardImageState.rotationClass)}
            src={`cached-image://${props.card.cardId}/?size=normal&side=${cardImageState.currentDisplayedSide}`}
          />
          <div style={{ display: "flex", flexFlow: "row", justifyContent: "center", margin: "5px" }}>
            {
              renderButtons()
            }
          </div>
        </SectionCard>
      }
    </>
  );

  function renderButtons(): Array<React.JSX.Element> {
    const result = new Array<React.JSX.Element>();
    result.push((
      <Button key="reverse" onClick={onReverseClicked}>Reverse</Button>
    ));
    if (props.card.cardLayout == "flip") {
      result.push((
        <Button key="flip" onClick={onFlipClicked}>Flip</Button>
      ));
    }
    if (props.card.cardLayout == "art_series") {
      result.push((
        <Button key="flip" onClick={onRotateClicked}>Rotate</Button>
      ));
    }

    return result;
  }
  //#endregion
}
