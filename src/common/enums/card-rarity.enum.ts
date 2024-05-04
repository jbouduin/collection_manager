enum ECardRarity {
  common,
  uncommon,
  rare,
  special,
  mythic,
  bonus,
}

export type CardRarity = keyof typeof ECardRarity;
