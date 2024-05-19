enum ECardBorderColor {
  black,
  borderless,
  gold,
  silver,
  white,
}

export type CardBorderColor = keyof typeof ECardBorderColor;
