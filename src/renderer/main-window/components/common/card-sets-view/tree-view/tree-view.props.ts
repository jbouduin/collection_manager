import { Props } from "@blueprintjs/core";

import { CardSetType } from "../../../../../../common/enums";
import { CardSetGroupBy, CardSetSort, CardSetViewmodel } from "../../../../viewmodels";
import { DtoLanguage } from "../../../../../../common/dto";

export interface TreeViewProps extends Props {
  cardSets: Array<CardSetViewmodel>;
  textFilter: string;
  cardSetSort: CardSetSort;
  cardSetGroupBy: CardSetGroupBy;
  cardSetTypeFilter: Map<CardSetType, boolean>;

  onSetsSelected(sets: Array<CardSetViewmodel>): void;
}
