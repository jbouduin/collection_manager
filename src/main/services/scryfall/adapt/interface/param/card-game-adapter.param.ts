import { Game } from "../../../../../../common/enums";

export type CardGameAdapterParameter = {
  card_id: string;
  games: Array<Game>;
};
