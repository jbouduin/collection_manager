import { ImageSize } from "../../enums";
import { CardSide } from "../types";

export interface DtoCardImageData {
  cardId: string;
  collectorNumber: string,
  cardBackId: string,
  setCode: string,
  language: string,
  imageType: ImageSize,
  side: CardSide
}
