import { CardSetGroupBy, CardSetSort, CardSetType } from "../../../common/enums";

export interface DtoDatabaseViewConfiguration {
  cardSetSort: CardSetSort;
  cardSetGroupBy: CardSetGroupBy;
  cardSetTypeFilter: Record<CardSetType, boolean>
}
