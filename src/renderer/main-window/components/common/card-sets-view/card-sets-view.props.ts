import { Props } from "@blueprintjs/core";

import { CardSetViewmodel } from "../../../viewmodels";

export interface CardSetsViewProps extends Props {
  onSetsSelected(sets: Array<CardSetViewmodel>): void;
}
