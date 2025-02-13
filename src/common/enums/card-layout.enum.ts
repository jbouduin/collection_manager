/* eslint-disable @typescript-eslint/no-unused-vars */
enum ECardLayout {
  normal,
  split,
  flip,
  transform,
  modal_dfc,
  meld,
  leveler,
  class,
  case,
  saga,
  adventure,
  mutate,
  prototype,
  battle,
  planar,
  scheme,
  vanguard,
  token,
  double_faced_token,
  emblem,
  augment,
  host,
  art_series,
  reversible_card
}

export type CardLayout = keyof typeof ECardLayout;
