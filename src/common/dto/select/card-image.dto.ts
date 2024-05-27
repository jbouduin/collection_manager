import { ImageSize } from "../../enums";

export interface CardImageDto {
  collectorNumber: string,
  sequence: number,
  imageUri: string,
  setCode: string,
  language: string,
  imageType: ImageSize
}
