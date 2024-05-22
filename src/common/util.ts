import { CardLayout } from "./enums";

export function isSingleCardFaceLayout(layout: CardLayout) {
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
