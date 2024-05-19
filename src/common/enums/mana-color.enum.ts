enum EManaColor {
  W,
  U,
  R,
  B,
  G,
  C
}

export type ManaColor = keyof typeof EManaColor;
