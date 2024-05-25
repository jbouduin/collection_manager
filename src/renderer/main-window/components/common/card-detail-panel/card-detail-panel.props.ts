import { Props } from "@blueprintjs/core";

import { DtoLanguage } from "../../../../../common/dto";
import { CardSetViewmodel, CardViewmodel } from "../../../viewmodels";

export interface CardDetailPanelProps extends Props {
  selectedCard?: CardViewmodel;
  cardSet?: CardSetViewmodel;
  symbolSvgs: Map<string, string>;
  languages: Array<DtoLanguage>;
}
