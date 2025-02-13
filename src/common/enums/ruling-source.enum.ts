/* eslint-disable @typescript-eslint/no-unused-vars */
enum ERulingSource {
  wotc,
  scryfall
}

export type RulingSource = keyof typeof ERulingSource;
