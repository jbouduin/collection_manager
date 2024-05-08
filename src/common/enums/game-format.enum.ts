enum EGameFormat {
  standard,
  future,
  historic,
  gladiator,
  pioneer,
  explorer,
  modern,
  legacy,
  pauper,
  vintage,
  penny,
  commander,
  oathbreaker,
  brawl,
  historicbrawl,
  alchemy,
  paupercommander,
  duel,
  premodern,
  oldschool,
}

export type GameFormat = keyof typeof EGameFormat;
