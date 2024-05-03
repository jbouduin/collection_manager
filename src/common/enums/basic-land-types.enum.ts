enum EBasicLandType {
  Plains,
  Island,
  Swamp,
  Mountain,
  Forest
}

export type BasicLandType = keyof typeof EBasicLandType;
