import { Props } from "@blueprintjs/core";

import { CardSetGroupBy, CardSetSort, CardSetType } from "../../../../../../common/enums";
import { CardSetViewmodel } from "../../../../viewmodels";

export interface TreeViewProps extends Props {
  cardSets: Array<CardSetViewmodel>;
  textFilter: string;
  cardSetSort: CardSetSort;
  cardSetGroupBy: CardSetGroupBy;
  cardSetTypeFilter: Record<CardSetType, boolean>;

  onSynchronizeSet: (setCode: string) => void;
  onSetsSelected: (sets: Array<CardSetViewmodel>) => void;
  onCardSetDialog: (cardSet: CardSetViewmodel) => void;
}
