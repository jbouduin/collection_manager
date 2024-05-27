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
  return oracle_id == "c3df3574-c4da-415f-a56b-807ed8e41d73" || oracle_id == "1c747fe2-289e-492a-a846-aa77707e2dc3";
}
