import { Props } from "@blueprintjs/core";
import { CardSetSelectDto, LanguageSelectDto } from "../../../../common/dto";

// LATER move these to a store
export interface DesktopProps extends Props {
  cardSets: Array<CardSetSelectDto>;
  cachedSvg: Map<string, string>;
  languages: Array<LanguageSelectDto>;
}
