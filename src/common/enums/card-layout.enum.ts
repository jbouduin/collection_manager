enum ECardLayout {
  normal,
  split,
  flip,
  transform,
  modal_dfc,
  meld,
  leveler,
  saga,
  adventure,
  planar,
  scheme,
  vanguard,
  token,
  double_faced_token,
  emblem,
  augment,
  host,
  art_series,
  double_sided,
}

export type CardLayout = keyof typeof ECardLayout;
