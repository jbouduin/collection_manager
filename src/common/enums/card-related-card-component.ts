/* eslint-disable @typescript-eslint/no-unused-vars */
enum ECardRelatedCardComponent {
  token,
  meld_part,
  meld_result,
  combo_piece
}

export type CardRelatedCardComponent = keyof typeof ECardRelatedCardComponent;
