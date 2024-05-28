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
    oracle_id == "1c747fe2-289e-492a-a846-aa77707e2dc3" || // multi language split card from Breaking news (OTP)
    oracle_id == "0664dcc8-fa68-4802-936f-ecd2979ebf3c" || // flip card (token) from Wilds of Eldraine Tokens (TWOE)
    oracle_id == "322e3bc1-2dfa-4d5f-848f-a82d9ce02a67" || // saga (WOE)
    oracle_id == "d369a02b-c282-454a-9f89-480f4f5d838c" || // leveler "Lord of Shatterskull Pass  Rise of Eldrazi Promos (PROE)
    oracle_id == "6dccf583-1045-4058-86cc-ebbcc8de080e" || // class: Artificer Class - Commander Legends: Battle for Baldur's Gate (CLB)
    oracle_id == "f85eea8f-5887-4921-a943-d15e0ad1e028" // case: Case of the Ransacked Lab - Murders at Karlov Manor Promos (PMKM)
}
