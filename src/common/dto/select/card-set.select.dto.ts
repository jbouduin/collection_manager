import { CardSet } from "../../../main/database/schema";

export interface CardSetDto {
  cardSet: CardSet;
  svg: string;
  // TODO indication whether the set has been synchronized or not
}
