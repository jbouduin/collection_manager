import { Props } from "@blueprintjs/core";
import { DtoCardSet, DtoLanguage } from "../../../../../common/dto";
import { CardViewmodel } from "../../../view-models/card.view-model";

export interface CardsTableProps extends Props {
  cachedSvg: Map<string, string>;
  languages: Array<DtoLanguage>;
  selectedSets: Array<DtoCardSet>;
  onCardsSelected(cards?: Array<CardViewmodel>): void;
}
