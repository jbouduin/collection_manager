/* eslint-disable @typescript-eslint/no-unused-vars */
enum EMTGColorType {
  card,
  identity,
  indicator,
  produced_mana
}

export type MTGColorType = keyof typeof EMTGColorType;
