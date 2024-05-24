import { Props } from "@blueprintjs/core";

import { CardViewmodel } from "../../../view-models/card.view-model";

export interface OracleProps extends Props {
  card?: CardViewmodel;
}
