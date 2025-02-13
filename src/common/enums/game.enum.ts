/* eslint-disable @typescript-eslint/no-unused-vars */
enum EGame {
  paper,
  arena,
  mtgo
}

export type Game = keyof typeof EGame;
