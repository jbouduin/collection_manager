enum EGame {
  paper,
  arena,
  mtgo,
}

export type Game = keyof typeof EGame;
