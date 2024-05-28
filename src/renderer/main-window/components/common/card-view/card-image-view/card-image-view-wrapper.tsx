import * as React from "react";
import { CardImageViewWrapperProps } from "./card-image-view-wrapper.props";
import { CardImageView } from "./card-image-view";

export function CardImageViewWrapper(props: CardImageViewWrapperProps) {

  //#region State -------------------------------------------------------------
  const [rotationClass, setRotationClass] = React.useState<string>("");
  const [cardfaceSequence, setCardfaceSequence] = React.useState<number>(0);
  //#endregion

  //#region Event handling ----------------------------------------------------
  const onFlipClicked = React.useCallback(
    () => {
      console.log("flip clicked, current", rotationClass);
      if (rotationClass == "") {
        setRotationClass("rotate-180");
      } else {
        setRotationClass("");
      }
    },
    [rotationClass, props.card]
  );

  const onReverseClicked = React.useCallback(
    () => {
      console.log("reverse clicked");
      if (cardfaceSequence == 0) {
        setCardfaceSequence(1);
      } else {
        setCardfaceSequence(0);
      }
    },
    [cardfaceSequence, props.card]
  );
  //#endregion

  //#region effect ------------------------------------------------------------
  React.useEffect(
    () => {
      setRotationClass(props.card.cardLayout == "split" || props.card.cardLayout == "planar" ? "rotate-90" : "");
      setCardfaceSequence(0);
    },
    [props.card]
  );
  //#endregion

  //#region Main --------------------------------------------------------------
  return (
    <div>
      {
        render()
      }
    </div>
  );
  //#endregion

  //#region Auxiliary methods -------------------------------------------------
  function render(): React.JSX.Element {
    switch (props.card.cardLayout) {
      case "adventure":
      case "augment":
      case "battle": // no idea what this looks like
      case "case":
      case "class":
      case "emblem":
      case "host":
      case "leveler":
      case "mutate":
      case "normal":
      case "planar":
      case "prototype":
      case "saga":
      case "scheme":
      case "split":
      case "token":
      case "vanguard":
        return (
          <CardImageView
            className={props.className}
            cardfaceSequence={0}
            cardId={props.card.cardId}
            rotationClass={rotationClass}
          />
        );
      case "flip":
        return (
          <CardImageView
            className={props.className}
            cardfaceSequence={0}
            cardId={props.card.cardId}
            rotationClass={rotationClass}
            onFlipClicked={onFlipClicked}
          />
        );
      case "transform":
      case "modal_dfc":
      case "meld":
      case "double_faced_token":
      case "art_series":
      case "double_sided":
        return (
          <CardImageView
            className={props.className}
            cardfaceSequence={cardfaceSequence}
            cardId={props.card.cardId}
            rotationClass={rotationClass}
            onReverseClicked={onReverseClicked}
          />
        );
    }
  }
  //#endregion
}
