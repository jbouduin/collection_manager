import { CardSetGroupBy, CardSetSort, CardSetType } from "../../../../../common/enums";

export interface CardSetsViewState {
  textFilterValue: string;
  cardSetSort: CardSetSort;
  cardSetGroupBy: CardSetGroupBy;
  cardSetTypeFilter: Record<CardSetType, boolean>
}
