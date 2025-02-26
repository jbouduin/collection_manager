import { CardSide, ImageSize } from "../../../types";


export interface MtgCardImageDataDto {
  cardId: string;
  collectorNumber: string;
  cardBackId: string;
  setCode: string;
  language: string;
  imageType: ImageSize;
  side: CardSide;
}
