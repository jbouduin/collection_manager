import { Props } from "@blueprintjs/core";

import { CardSetViewmodel } from "../../../viewmodels";
import { CardSetGroupBy, CardSetSort, CardSetType } from "../../../../../common/enums";

export interface CardSetsViewProps extends Props {
  defaultCardSetSort: CardSetSort;
  defaultCardSetGroupBy: CardSetGroupBy;
  defaultCardSetTypeFilter: Record<CardSetType, boolean>;
  onSetsSelected(sets: Array<CardSetViewmodel>): void;
  onSynchronizeSet: (setCode: string) => void;
  onCardSetDialog: (cardSet: CardSetViewmodel) => void;
}
