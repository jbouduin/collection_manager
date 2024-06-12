import { Props } from "@blueprintjs/core";

import { CardSetType } from "../../../../../..//common/enums";
import { CardSetGroupBy, CardSetSort } from "../../../../viewmodels";

export interface HeaderViewProps extends Props{
  cardSetSort: CardSetSort;
  cardSetGroupBy: CardSetGroupBy;
  cardSetTypeFilter: Record<CardSetType, boolean>;
  onCardSetSortChanged: (cardSetSort: CardSetSort) => void;
  onCardSetGroupByChanged: (cardSetGroupBy: CardSetGroupBy) => void;
  onCardSetTypeFilterChanged: (cardSetType: CardSetType) => void;
  onTextFilterChanged: (filter: string) => void;
}
