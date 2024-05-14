import { CardSet } from "../../../main/database/schema";

export interface CardSetSelectDto {
  cardSet: CardSet;
  svg: string;
  // TODO indication whether the set has been synchronized or not
}
