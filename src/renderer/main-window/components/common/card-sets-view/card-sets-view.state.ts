import { CardSetGroupBy, CardSetSort, CardSetType } from "../../../../../common/enums";

// NOW create viewmodel for treeview containing all this
export interface CardSetsViewState {
  cardSetFilterValue: string;
  cardSetSort: CardSetSort;
  cardSetGroupBy: CardSetGroupBy;
  cardSetTypeFilter: Array<CardSetType>
}
