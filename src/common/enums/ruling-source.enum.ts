enum ERulingSource {
  wotc,
  scryfall
}

export type RulingSource = keyof typeof ERulingSource;
