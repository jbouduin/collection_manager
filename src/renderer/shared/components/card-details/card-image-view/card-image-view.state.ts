import { CardSide } from "../../../../../common/types";

export type RotationClass = "" | "rotate-180" | "rotate-90";

export interface CardImageViewState {
  rotationClass: RotationClass;
  currentDisplayedSide: CardSide;
}
