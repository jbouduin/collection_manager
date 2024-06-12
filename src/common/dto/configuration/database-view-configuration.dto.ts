import { CardSetGroupBy, CardSetSort, CardSetType } from "../../../common/enums";

export interface DtoDatabaseViewConfiguration {
  cardSetSort: CardSetSort;
  cardSetGroupBy: CardSetGroupBy;
  // NOW switch to array - this will make migrations easier in the future
  cardSetTypeFilter: Record<CardSetType, boolean>
}
