enum ECardFinish {
  foil,
  nonfoil,
  etched,
  glossy,
}

export type CardFinish = keyof typeof ECardFinish;
