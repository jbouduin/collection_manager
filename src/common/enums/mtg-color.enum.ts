enum EMTGColor {
  W,
  U,
  R,
  B,
  G,
  C // Colorless
}

export type MTGColor = keyof typeof EMTGColor;
