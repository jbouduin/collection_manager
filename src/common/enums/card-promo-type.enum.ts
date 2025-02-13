/* eslint-disable @typescript-eslint/no-unused-vars */
enum ECardPromoType {
  tourney,
  prerelease,
  datestamped,
  planeswalkerdeck,
  buyabox,
  judgegift,
  event,
  convention,
  starterdeck,
  instore,
  setpromo,
  fnm,
  openhouse,
  league,
  draftweekend,
  gameday,
  release,
  intropack,
  giftbox,
  duels,
  wizardsplaynetwork,
  premiereshop,
  playerrewards,
  gateway,
  arenaleague
}

export type CardPromoType = keyof typeof ECardPromoType;
