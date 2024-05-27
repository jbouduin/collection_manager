import { CardLayout } from "./enums";

export function isSingleCardFaceLayout(layout: CardLayout):boolean {
  return [
    "normal",
    "leveler",
    "class",
    "case",
    "saga",
    "mutate",
    "prototype",
    "planar",
    "scheme",
    "vanguard",
    "token",
    "emblem",
    "augment",
    "host"
  ].indexOf(layout) >= 0;
}

export function canSynchronize(oracle_id: string):boolean {
  return oracle_id == "c3df3574-c4da-415f-a56b-807ed8e41d73" || //(one multi lang, one english only) normal card from Breaking news (OTP)
      oracle_id == "1c747fe2-289e-492a-a846-aa77707e2dc3" ||  // multi language split card from Breaking news (OTP)
    oracle_id == "0664dcc8-fa68-4802-936f-ecd2979ebf3c"; // flip card (token) from Wilds of Eldraine Tokens (TWOE)
}
