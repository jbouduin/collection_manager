import { Card } from "../../../main/database/schema";

export interface CardSelectDto {
  card: Card;
  manaCostArray: Array<string>;
  collectorNumberSortValue: string;
}
