/* eslint-disable @typescript-eslint/no-unused-vars */
enum EImageStatus {
  missing,
  placeholder,
  lowres,
  highres_scan
}

export type ImageStatus = keyof typeof EImageStatus;

export const ImageStatusDisplayValue = new Map<ImageStatus, string>([
  ["missing", "Missing"],
  ["placeholder", "Placeholder"],
  ["lowres", "Low resolution"]
  // "highres_scan" => not ot be shown in the front end
]);
