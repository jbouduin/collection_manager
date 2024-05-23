import { Props } from "@blueprintjs/core";
import { DtoCardSet, DtoLanguage } from "../../../../common/dto";

// LATER move these to a store
export interface DesktopProps extends Props {
  cardSets: Array<DtoCardSet>;
  cachedSvg: Map<string, string>;
  languages: Array<DtoLanguage>;
}
