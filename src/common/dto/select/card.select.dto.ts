import { Card } from "../../../main/database/schema";

export interface CardDto {
  card: Card;
  manaCostArray: Array<string>;
  collectorNumberSortValue: string;
}
