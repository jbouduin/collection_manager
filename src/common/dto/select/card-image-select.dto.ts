import { ImageSize } from "../../../common/enums";

export interface CardImageDto {
  collectorNumber: string,
  imageUri: string,
  setCode: string,
  language: string,
  imageType: ImageSize
}
