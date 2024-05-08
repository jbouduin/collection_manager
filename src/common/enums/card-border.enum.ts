enum ECardBorder {
  black,
  borderless,
  gold,
  silver,
  white,
}

export type CardBorder = keyof typeof ECardBorder;
