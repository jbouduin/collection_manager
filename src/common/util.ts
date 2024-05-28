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
  return oracle_id == "c3df3574-c4da-415f-a56b-807ed8e41d73" || // normal: (one multi lang, one english only) from Breaking news (OTP)
    oracle_id == "1c747fe2-289e-492a-a846-aa77707e2dc3" || // split: multi language from Breaking news (OTP)
    oracle_id == "0664dcc8-fa68-4802-936f-ecd2979ebf3c" || // flip:  (token) from Wilds of Eldraine Tokens (TWOE)
    oracle_id == "322e3bc1-2dfa-4d5f-848f-a82d9ce02a67" || // saga (WOE)
    oracle_id == "d369a02b-c282-454a-9f89-480f4f5d838c" || // leveler: "Lord of Shatterskull Pass  Rise of Eldrazi Promos (PROE)
    oracle_id == "6dccf583-1045-4058-86cc-ebbcc8de080e" || // class: Artificer Class - Commander Legends: Battle for Baldur's Gate (CLB)
    oracle_id == "f85eea8f-5887-4921-a943-d15e0ad1e028" || // case: Case of the Ransacked Lab - Murders at Karlov Manor Promos (PMKM)
    oracle_id == "8c1b3f1b-40d8-4cd5-bedf-92c3c534be84" || // mutate: Cubwarden - Ikoria: Lair of Behemoths Promos (PIKO)
    oracle_id == "792f8235-f23b-4858-bdd4-c7a186b7a470" || // prototype: Arcane Proxy {7} - The Brothers' War Promos (PBRO)
    oracle_id == "c54101eb-8c10-420d-8172-d5985f348463" || // schema: Your Inescapable Doom - DCI Promos (PDCI)
    // FEATURE vanguard has "show back on scryfall", but it looks like a normal back"
    oracle_id == "5ad380b9-18e0-4613-859d-8a378c4dfebd" // vanguard: Mishra - Vanguard Series (PVAN)
}
