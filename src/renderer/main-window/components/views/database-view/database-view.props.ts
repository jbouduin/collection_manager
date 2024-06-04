import { Props } from "@blueprintjs/core";

import { CardSetViewmodel } from "../../../viewmodels";

export interface DatabaseViewProps extends Props {
  cardSets: Array<CardSetViewmodel>;
}
