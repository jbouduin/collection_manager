import { Props } from "@blueprintjs/core";

import { DtoCardSet, DtoLanguage } from "../../../../../common/dto";
import { CardViewmodel } from "../../../view-models/card.view-model";

export interface CardDetailPanelProps extends Props {
  card?: CardViewmodel;
  cardSet?: DtoCardSet;
  languages: Array<DtoLanguage>;
}
