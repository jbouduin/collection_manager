enum EMTGColorType {
  card,
  identity,
  indicator,
  produced_mana
}

export type MTGColorType = keyof typeof EMTGColorType;
