import { ImageType } from "../../../common/enums";

export interface CardImageSelectDto {
  collectorNumber: string,
  imageUri: string,
  setCode: string,
  language: string,
  imageType: ImageType
}
