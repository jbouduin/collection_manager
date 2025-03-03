import { CardSetGroupBy, CardSetSort, CardSetType } from "../../types";

export interface MtgSetTreeViewConfigurationDto {
  cardSetSort: CardSetSort;
  cardSetGroupBy: CardSetGroupBy;
  cardSetTypeFilter: Array<CardSetType>;
}
