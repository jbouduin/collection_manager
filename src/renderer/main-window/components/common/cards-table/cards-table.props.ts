import { Props } from "@blueprintjs/core";
import { DtoCardSet, LanguageDto } from "../../../../../common/dto";
import { CardViewmodel } from "../../../view-models/card.view-model";

export interface CardsTableProps extends Props {
  cachedSvg: Map<string, string>;
  languages: Array<LanguageDto>;
  selectedSets: Array<DtoCardSet>;
  onCardsSelected(cards?: Array<CardViewmodel>): void;
}
