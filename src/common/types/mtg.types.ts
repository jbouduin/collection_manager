/*
 * TODO eventually move types that have to be sortable and could extend over time to the database *
 * - Legality: should be sortable
 *
 */
export type BasicLandType = "Plains" | "Island" | "Swamp" | "Mountain" | "Forest";
export type CardBorderColor = "black" | "borderless" | "gold" | "silver" | "white";
export type CardFinish = "foil" | "nonfoil" | "etched" | "glossy";
export type CardFrameEffect =
  "legendary" |
  "miracle" |
  "nyxtouched" |
  "draft" |
  "devoid" |
  "tombstone" |
  "colorshifted" |
  "inverted" |
  "sunmoondfc" |
  "compasslanddfc" |
  "originpwdfc" |
  "mooneldrazidfc" |
  "moonreversemoondfc" |
  "showcase" |
  "extendedart" |
  "companion" |
  "etched" |
  "snow" |
  "lesson" |
  "shatteredglass" |
  "convertdfc" |
  "fandfc" |
  "upsidedowndfc";
export type CardFrame = "1993" | "1997" | "2003" | "2015" | "Future";
export type CardLayout =
  "normal" |
  "split" |
  "flip" |
  "transform" |
  "modal_dfc" |
  "meld" |
  "leveler" |
  "class" |
  "case" |
  "saga" |
  "adventure" |
  "mutate" |
  "prototype" |
  "battle" |
  "planar" |
  "scheme" |
  "vanguard" |
  "token" |
  "double_faced_token" |
  "emblem" |
  "augment" |
  "host" |
  "art_series" |
  "reversible_card";
export type CardLegality = "legal" | "not_legal" | "restricted" | "banned";
export type CardPromoType =
  "tourney" |
  "prerelease" |
  "datestamped" |
  "planeswalkerdeck" |
  "buyabox" |
  "judgegift" |
  "event" |
  "convention" |
  "starterdeck" |
  "instore" |
  "setpromo" |
  "fnm" |
  "openhouse" |
  "league" |
  "draftweekend" |
  "gameday" |
  "release" |
  "intropack" |
  "giftbox" |
  "duels" |
  "wizardsplaynetwork" |
  "premiereshop" |
  "playerrewards" |
  "gateway" |
  "arenaleague";
export type CardRarity =
  "common" |
  "uncommon" |
  "rare" |
  "special" |
  "mythic" |
  "bonus";
export type CardRelatedCardComponent = "token" | "meld_part" | "meld_result" | "combo_piece";
export type CardSecurityStamp =
  "oval" |
  "triangle" |
  "acorn" |
  "circle" |
  "arena" |
  "heart";
export type CardSetType =
  "core" |
  "expansion" |
  "masters" |
  "alchemy" |
  "masterpiece" |
  "arsenal" |
  "from_the_vault" |
  "spellbook" |
  "premium_deck" |
  "duel_deck" |
  "draft_innovation" |
  "treasure_chest" |
  "commander" |
  "planechase" |
  "archenemy" |
  "vanguard" |
  "funny" |
  "starter" |
  "box" |
  "promo" |
  "token" |
  "memorabilia" |
  "minigame";
export type MtgGameFormat =
  "alchemy" |
  "brawl" |
  "commander" |
  "duel" |
  "explorer" |
  "future" |
  "gladiator" |
  "historic" |
  "legacy" |
  "modern" |
  "oathbreaker" |
  "oldschool" |
  "pauper" |
  "paupercommander" |
  "penny" |
  "pioneer" |
  "predh" |
  "premodern" |
  "standard" |
  "standardbrawl" |
  "timeless" |
  "vintage";
export type Game = "paper" | "arena" | "mtgo";
export type MtgColorType =
  "card" |
  "identity" |
  "indicator" |
  "produced_mana";
export type MtgColor =
  "W" |
  "U" |
  "R" |
  "B" |
  "G" |
  "C"; // Colorless
export type MtgLanguage =
  "en" |
  "es" |
  "fr" |
  "de" |
  "it" |
  "pt" |
  "ja" |
  "ko" |
  "ru" |
  "zhs" |
  "zht" |
  "he" |
  "la" |
  "grc" |
  "ar" |
  "sa" |
  "ph";
