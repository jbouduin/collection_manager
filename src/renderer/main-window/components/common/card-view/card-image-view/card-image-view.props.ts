import { Props } from "@blueprintjs/core";

export interface CardImageViewProps extends Props {
  cardId: string,
  cardfaceSequence: number;
  rotationClass: string;
  onFlipClicked?: () => void;
  onReverseClicked?: () => void;
}
