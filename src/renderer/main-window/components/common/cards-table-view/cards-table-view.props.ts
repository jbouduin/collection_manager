import { Props } from "@blueprintjs/core";

import { DtoLanguage } from "../../../../../common/dto";
import { CardSetViewmodel, CardViewmodel } from "../../../viewmodels";


export interface CardsTableViewProps extends Props {
  symbolSvgs: Map<string, string>;
  languages: Array<DtoLanguage>;
  selectedSets: Array<CardSetViewmodel>;
  onCardsSelected(cards?: Array<CardViewmodel>): void;
}