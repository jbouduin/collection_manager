import { CardSide, ImageSize } from "../../types";


export interface IMtgCardImageDataDto {
  cardId: string;
  collectorNumber: string;
  cardBackId: string;
  setCode: string;
  language: string;
  imageType: ImageSize;
  side: CardSide;
}
