import { Props } from "@blueprintjs/core";

import { CardSetViewmodel } from "../../../viewmodels";

export interface CardViewProps extends Props {
  cardId: string;
  cardSet?: CardSetViewmodel;
}
