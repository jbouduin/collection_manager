enum EImageStatus {
  missing,
  placeholder,
  lowres,
  highres_scan,
}

export type ImageStatus = keyof typeof EImageStatus;
