import { ImageSize } from "../../enums";

export interface CardImageDto {
  collectorNumber: string,
  imageUri: string,
  setCode: string,
  language: string,
  imageType: ImageSize
}
