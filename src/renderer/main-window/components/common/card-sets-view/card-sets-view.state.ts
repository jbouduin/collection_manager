import { CardSetGroupBy, CardSetSort, CardSetType } from "../../../../../common/enums";

export interface CardSetsViewState {
  cardSetFilterValue: string;
  cardSetSort: CardSetSort;
  cardSetGroupBy: CardSetGroupBy;
  cardSetTypeFilter: Array<CardSetType>
}
