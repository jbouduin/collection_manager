import { CardSetGroupBy, CardSetSort, CardSetType } from "../../types";

export interface DtoDatabaseTreeViewConfiguration {
  cardSetSort: CardSetSort;
  cardSetGroupBy: CardSetGroupBy;
  cardSetTypeFilter: Array<CardSetType>;
}
