import { Props } from "@blueprintjs/core";
import { CardDto, CardSetDto, LanguageDto } from "../../../../../common/dto";

export interface CardsTableProps extends Props {
  cachedSvg: Map<string, string>;
  languages: Array<LanguageDto>;
  selectedSets: Array<CardSetDto>;
  onCardsSelected(cards?: Array<CardDto>): void;
}
