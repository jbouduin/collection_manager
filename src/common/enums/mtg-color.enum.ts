/* eslint-disable @typescript-eslint/no-unused-vars */
enum EMTGColor {
  W,
  U,
  R,
  B,
  G,
  C // Colorless
}

export type MTGColor = keyof typeof EMTGColor;
