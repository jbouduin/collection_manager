enum ECardSetGroupBy {
  none,
  parent,
  block,
  setType
}

export type CardSetGroupBy = keyof typeof ECardSetGroupBy;
