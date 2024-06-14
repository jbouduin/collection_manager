import { CardSetGroupBy, CardSetSort, CardSetType } from "../../enums";

export interface DtoDatabaseTreeViewConfiguration {
  cardSetSort: CardSetSort;
  cardSetGroupBy: CardSetGroupBy;
  cardSetTypeFilter: Array<CardSetType>;
}
