import { Props } from "@blueprintjs/core";

import { DtoLanguage } from "../../../../common/dto";
import { CardSetViewmodel } from "../../viewmodels";

export interface DesktopProps extends Props {
  cardSets: Array<CardSetViewmodel>;
  cachedSvg: Map<string, string>;
  languages: Array<DtoLanguage>;
}
