import { Props } from "@blueprintjs/core";

import { CardfaceViewmodel } from "../../../../viewmodels";

export interface CardImageViewProps extends Props {
  cardface: CardfaceViewmodel;
  rotationClass: string;
  onFlipClicked?: () => void;
}
