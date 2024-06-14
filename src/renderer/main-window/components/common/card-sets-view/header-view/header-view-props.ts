import { Props } from "@blueprintjs/core";

import { CardSetGroupBy, CardSetSort, CardSetType } from "../../../../../..//common/enums";

export interface HeaderViewProps extends Props{
  cardSetSort: CardSetSort;
  cardSetGroupBy: CardSetGroupBy;
  cardSetTypeFilter: Array<CardSetType>;
  onCardSetSortChanged: (cardSetSort: CardSetSort) => void;
  onCardSetGroupByChanged: (cardSetGroupBy: CardSetGroupBy) => void;
  onCardSetTypeFilterChanged: (cardSetType: CardSetType) => void;
  onTextFilterChanged: (filter: string) => void;
}
