enum ECardColorType {
  card,
  identity,
  indicator,
  produced_mana
}

export type CardColorType = keyof typeof ECardColorType;
