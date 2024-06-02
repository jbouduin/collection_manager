enum ECardSetType {

  /** A yearly Magic core set (Tenth Edition, etc) */
  core,

  /** A rotational expansion set in a block (Zendikar, etc) */
  expansion,

  /** A reprint set that contains no new cards (Modern Masters, etc) */
  masters,

  /** An Arena set designed for Alchemy */
  alchemy,

  /** Masterpiece Series premium foil cards */
  masterpiece,

  /** A Commander-oriented gift set */
  arsenal,

  /** From the Vault gift sets */
  from_the_vault,

  /** Spellbook series gift sets */
  spellbook,

  /** Premium Deck Series decks */
  premium_deck,

  /** Duel Decks */
  duel_deck,

  /** Special draft sets, like Conspiracy and Battlebond */
  draft_innovation,

  /** Magic Online treasure chest prize sets */
  treasure_chest,

  /** Commander preconstructed decks */
  commander,

  /** Planechase sets */
  planechase,

  /** Archenemy sets */
  archenemy,

  /** Vanguard card sets */
  vanguard,

  /** A funny un-set or set with funny promos (Unglued, Happy Holidays, etc) */
  funny,

  /** A starter/introductory set (Portal, etc) */
  starter,

  /** A gift box set */
  box,

  /** A set that contains purely promotional cards */
  promo,

  /** A set made up of tokens and emblems. */
  token,

  /** A set made up of gold-bordered, oversize, or trophy cards that are not legal */
  memorabilia,

  /** A set that contains minigame card inserts from booster packs */
  minigame,
}

export type CardSetType = keyof typeof ECardSetType;
