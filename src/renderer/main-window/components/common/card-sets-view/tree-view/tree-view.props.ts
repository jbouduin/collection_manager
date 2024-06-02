import { Props } from "@blueprintjs/core";

import { CardSetViewmodel } from "../../../../viewmodels";

export interface TreeViewProps extends Props {
  cardSets: Array<CardSetViewmodel>;
  textFilter: string;
  onSetsSelected(sets: Array<CardSetViewmodel>): void;
}
