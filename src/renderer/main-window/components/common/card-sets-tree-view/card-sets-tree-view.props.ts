import { Props } from "@blueprintjs/core";

import { CardSetViewmodel } from "../../../viewmodels";

export interface CardSetTreeViewProps extends Props {
  cardSets: Array<CardSetViewmodel>;
  onSetsSelected(sets: Array<CardSetViewmodel>): void;
}
