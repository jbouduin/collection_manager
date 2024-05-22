import { Props } from "@blueprintjs/core";

import { CardSetDto } from "../../../../../common/dto";
import { CardViewmodel } from "../../../view-models/card.view-model";

export interface CardDetailPanelProps extends Props {
  card?: CardViewmodel;
  cardSet?: CardSetDto;
}
