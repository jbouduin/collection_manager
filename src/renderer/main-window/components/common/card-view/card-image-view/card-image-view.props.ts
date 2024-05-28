import { Props } from "@blueprintjs/core";

import { CardfaceViewmodel } from "../../../../viewmodels";

export interface CardImageViewProps extends Props {
  // cardface: CardfaceViewmodel;
  cardId: string,
  cardfaceSequence: number;
  rotationClass: string;
  onFlipClicked?: () => void;
  onReverseClicked?: () => void;
}
