import { Props } from "@blueprintjs/core";
import { CardSetDto, LanguageDto } from "../../../../common/dto";

// LATER move these to a store
export interface DesktopProps extends Props {
  cardSets: Array<CardSetDto>;
  cachedSvg: Map<string, string>;
  languages: Array<LanguageDto>;
}
