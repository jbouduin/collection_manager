import { Props } from "@blueprintjs/core";
import { CardSetDto, LanguageDto } from "../../../../../common/dto";
import { CardViewmodel } from "../../../view-models/card.view-model";

export interface CardsTableProps extends Props {
  cachedSvg: Map<string, string>;
  languages: Array<LanguageDto>;
  selectedSets: Array<CardSetDto>;
  onCardsSelected(cards?: Array<CardViewmodel>): void;
}
