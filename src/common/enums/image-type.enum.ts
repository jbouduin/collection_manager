enum EImageType {
  small,
  normal,
  large,
  png,
  art_crop,
  border_crop
}

export type ImageType = keyof typeof EImageType;
