/* eslint-disable @typescript-eslint/no-unused-vars */
enum ECardLegality {
  legal,
  not_legal,
  restricted,
  banned
}

export type CardLegality = keyof typeof ECardLegality;
