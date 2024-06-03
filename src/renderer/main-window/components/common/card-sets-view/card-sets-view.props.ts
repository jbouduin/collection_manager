import { Props } from "@blueprintjs/core";

import { CardSetViewmodel } from "../../../viewmodels";
import { DtoLanguage } from "../../../../../common/dto";

export interface CardSetsViewProps extends Props {
  cardSets: Array<CardSetViewmodel>;
  // TODO use a provider for languages
  languages: Array<DtoLanguage>;
  onSetsSelected(sets: Array<CardSetViewmodel>): void;
}
