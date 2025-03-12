import { CardSetGroupBy, CardSetSort, CardSetType } from "../../types";

export interface IMtgSetTreeViewConfigurationDto {
  cardSetSort: CardSetSort;
  cardSetGroupBy: CardSetGroupBy;
  cardSetTypeFilter: Array<CardSetType>;
}
