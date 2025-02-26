import { CardSetGroupBy, CardSetSort, CardSetType } from "../../types";

export interface DatabaseTreeViewConfigurationDto {
  cardSetSort: CardSetSort;
  cardSetGroupBy: CardSetGroupBy;
  cardSetTypeFilter: Array<CardSetType>;
}
