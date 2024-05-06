// TODO remove the string values and use (keyof typeof ECardSetTypex as datatype) after removing scryfall-sdk (currently set type is the scryfall-sdk one)

enum ECardSetType {
  /** A yearly Magic core set (Tenth Edition, etc) */
  Core,

  /** A rotational expansion set in a block (Zendikar, etc) */
  Expansion,

  /** A reprint set that contains no new cards (Modern Masters, etc) */
  Masters,

  /** An Arena set designed for Alchemy */
  Alchemy,

  /** Masterpiece Series premium foil cards */
  Masterpiece,

  /** A Commander-oriented gift set */
  Arsenal,

  /** From the Vault gift sets */
  FromTheVault,

  /** Spellbook series gift sets */
  Spellbook,

  /** Premium Deck Series decks */
  PremiumDeck,

  /** Duel Decks */
  DuelDeck,

  /** Special draft sets, like Conspiracy and Battlebond */
  DraftInnovation,

  /** Magic Online treasure chest prize sets */
  TreasureChest,

  /** Commander preconstructed decks */
  Commander,

  /** Planechase sets */
  Planechase,

  /** Archenemy sets */
  Archenemy,

  /** Vanguard card sets */
  Vanguard,

  /** A funny un-set or set with funny promos (Unglued, Happy Holidays, etc) */
  Funny,

  /** A starter/introductory set (Portal, etc) */
  Starter,

  /** A gift box set */
  Box,

  /** A set that contains purely promotional cards */
  Promo,

  /** A set made up of tokens and emblems. */
  Token,

  /** A set made up of gold-bordered, oversize, or trophy cards that are not legal */
  Memorabilia,

  /** A set that contains minigame card inserts from booster packs */
  Minigame,
}

export type CardSetType = keyof typeof ECardSetType;
