/* eslint-disable @typescript-eslint/no-unused-vars */
enum ECardBorderColor {
  black,
  borderless,
  gold,
  silver,
  white
}

export type CardBorderColor = keyof typeof ECardBorderColor;
