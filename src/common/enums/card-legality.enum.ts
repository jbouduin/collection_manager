enum ECardLegality {
  legal,
  not_legal,
  restricted,
  banned,
}

export type CardLegality = keyof typeof ECardLegality;
