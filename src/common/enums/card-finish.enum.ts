/* eslint-disable @typescript-eslint/no-unused-vars */
enum ECardFinish {
  foil,
  nonfoil,
  etched,
  glossy
}

export type CardFinish = keyof typeof ECardFinish;
