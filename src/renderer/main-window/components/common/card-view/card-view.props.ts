import { Props } from "@blueprintjs/core";

import { DtoLanguage } from "../../../../../common/dto";
import { CardSetViewmodel } from "../../../viewmodels";

export interface CardViewProps extends Props {
  cardId: string;
  cardSet?: CardSetViewmodel;
  symbolSvgs: Map<string, string>;
}
