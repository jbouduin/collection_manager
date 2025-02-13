import { CardLayout } from "./enums";

export function isSingleCardFaceLayout(layout: CardLayout): boolean {
  return [
    "normal",
    "leveler",
    "class",
    "case",
    "saga",
    "meld",
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

export function formatTimeStampedFileName(fileName: string) {
  const date = new Date();
  const datePart = [
    date.getMonth() + 1,
    date.getDate(),
    date.getFullYear()
  ].map((n: number, i: number) => n.toString().padStart(i === 2 ? 4 : 2, "0")).join("-");
  const timePart = [
    date.getHours(),
    date.getMinutes(),
    date.getSeconds()
  ].map((n: number) => n.toString().padStart(2, "0")).join("-");
  return `${datePart}.${timePart}.${fileName}`;
}

export const sqliteUTCTimeStamp = new Date().toISOString();

/* eslint-disable @stylistic/multiline-comment-style */
// export function canSynchronize(oracle_id: string): boolean {
//   return oracle_id == "c3df3574-c4da-415f-a56b-807ed8e41d73" || // normal: (one multi lang, one english only) from Breaking news (OTP)
//     oracle_id == "1c747fe2-289e-492a-a846-aa77707e2dc3" || // split: multi language from Breaking news (OTP)
//     oracle_id == "0664dcc8-fa68-4802-936f-ecd2979ebf3c" || // flip:  (token) from Wilds of Eldraine Tokens (TWOE)
//     oracle_id == "322e3bc1-2dfa-4d5f-848f-a82d9ce02a67" || // saga (WOE)
//     oracle_id == "d369a02b-c282-454a-9f89-480f4f5d838c" || // leveler: "Lord of Shatterskull Pass  Rise of Eldrazi Promos (PROE)
//     oracle_id == "6dccf583-1045-4058-86cc-ebbcc8de080e" || // class: Artificer Class - Commander Legends: Battle for Baldur's Gate (CLB)
//     oracle_id == "f85eea8f-5887-4921-a943-d15e0ad1e028" || // case: Case of the Ransacked Lab - Murders at Karlov Manor Promos (PMKM)
//     oracle_id == "8c1b3f1b-40d8-4cd5-bedf-92c3c534be84" || // mutate: Cubwarden - Ikoria: Lair of Behemoths Promos (PIKO)
//     oracle_id == "792f8235-f23b-4858-bdd4-c7a186b7a470" || // prototype: Arcane Proxy {7} - The Brothers' War Promos (PBRO)
//     oracle_id == "c54101eb-8c10-420d-8172-d5985f348463" || // schema: Your Inescapable Doom - DCI Promos (PDCI)//
//     oracle_id == "5ad380b9-18e0-4613-859d-8a378c4dfebd" || // vanguard: Mishra - Vanguard Series (PVAN)
//     oracle_id == "dd4c59c6-a051-4909-ae28-bc0367db2d30" || // token: Cragflame - Bloomburrow Tokens (TBLB)
//     oracle_id == "b7dc9439-d9bb-435a-8d3b-9e92bfae16ef" || // emblem: Domri Rade Emblem - Ravnica Remastered Tokens (TRVR)
//     oracle_id == "50a6c19d-7ec7-4e19-8ac5-d0ca09a998e5" || // augment: Half-Squirrel, Half- Unsanctioned (UND)
//     oracle_id == "957ba875-b8d4-48e2-bbd7-993694a936f3" || // host: Wild Crocodile - Unsanctioned (UND)
//     oracle_id == "eac8af5d-3deb-409b-8519-e9a8c3bbd856" || // adventure: Albiorix, Goose Tyrant - Alchemy: Outlaws of Thunder Junction (YOTJ)
//     oracle_id == "6dc67a65-31bf-4535-9e02-8f6d6ecefde5" || // planar: Chaotic Aether  - Planechase Anthology Planes (OPCA)
//     oracle_id == "a4b37d16-95b3-4143-a0b2-ad9f2aba91f8" || // transform: Welcome to . . . - Jurassic World Collection (REX)
//     oracle_id == "144119bc-7fd1-45c5-9e29-f742e7c255ac" || // modal_dfc: Clearwater Pathway - Zendikar Rising Promos (PZNR)
//     oracle_id == "42bccda5-1754-4619-b94f-7a72f934a718" || // meld: Titania, Voice of Gaea (melds with Argoth, Sanctum of Nature) - The Brothers' War Promos (PBRO)
//     oracle_id == "62648946-1708-48f4-ba40-c057563ab11b" || // meld: Argoth, Sanctum of Nature (melds with Titania, Voice of Gaea) - The Brothers' War Promos (PBRO)
//     oracle_id == "43230d70-4d60-4ceb-bb45-fbc043280652" || // meld: Titania, Gaea Incarnate (meld of the previous two) - The Brothers' War Promos (PBRO)
//     oracle_id == "3720f635-c0c3-4698-aed5-653444f1ab2b" || // double_face_token: Urza's Blueprints (minigame) - the brothers' war minigames
//     oracle_id == "c03f3ed5-963e-4fbf-9614-b7f21653e544" || // double_face_token: gremlin - League Tokens 2017 (L17)
//     oracle_id == "dd3bf75e-9ef0-4ded-9b65-1a60a78a6253" || // double_face_token: Incubator // Pyrexian - March of the Machine Tokens (TMOM)
//     oracle_id == "aa454a53-859c-4d54-b3e1-3764f67c00ff" || // art_series: (vertical) Sorin the Mirthless - Crimson Vow Art Series (AVOW)
//     oracle_id == "8e261397-f2d8-4929-8533-42ec8a411d52" || // art_series: (horizontal) Ancestor's Embrace - Crimson Vow Art Series (AVOW)
//     oracle_id == "b34bb2dc-c1af-4d77-b0b3-a0fb342a5fc6"; // reversible: Forest//Forest - Jurassic World Collection (REX) - these are exaclty the cards that have the oracle ids on face level
// }
