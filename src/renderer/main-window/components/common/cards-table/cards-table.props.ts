import { Props } from "@blueprintjs/core";
import { CardSelectDto, CardSetSelectDto, LanguageSelectDto } from "../../../../../common/dto";

export interface CardsTableProps extends Props {
  cachedSvg: Map<string, string>;
  languages: Array<LanguageSelectDto>;
  selectedSets: Array<CardSetSelectDto>;
  onCardsSelected(cards?: Array<CardSelectDto>): void;
}
