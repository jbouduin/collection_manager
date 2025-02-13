/* eslint-disable @typescript-eslint/no-unused-vars */
enum EImageSize {
  small,
  normal,
  large,
  png,
  art_crop,
  border_crop
}

export type ImageSize = keyof typeof EImageSize;
