enum EMTGColor {
  W,
  U,
  R,
  B,
  G
}

export type MTGColor = keyof typeof EMTGColor;
