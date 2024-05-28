import * as React from "react";
import { CardImageViewWrapperProps } from "./card-image-view-wrapper.props";
import { CardImageView } from "./card-image-view";

export function CardImageViewWrapper(props: CardImageViewWrapperProps) {

  //#region State -------------------------------------------------------------
  const [rotationClass, setRotationClass] = React.useState<string>("");
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
    [rotationClass, props.cardface]
  );

  const onReverseClicked = React.useCallback(
    () => {
      console.log("reverse clicked");

    },
    [rotationClass, props.cardface]
  )
  //#endregion

  //#region effect ------------------------------------------------------------
  React.useEffect(
    () => { setRotationClass(props.layout == "split" ? "rotate-90" : ""); },
    [props.cardface]
  );
  //#endregion

  //#region Main --------------------------------------------------------------
  return (
    <CardImageView
      className={props.className}
      cardfaceSequence={props.cardface.sequence}
      cardId={props.cardface.cardId}
      rotationClass={rotationClass}
      onFlipClicked={props.layout == "flip" ? onFlipClicked : null}
    />
  );
  //#endregion
}
