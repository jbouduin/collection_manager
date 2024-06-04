import { Props } from "@blueprintjs/core";

import { DtoLanguage } from "../../../../common/dto";
import { CardSetViewmodel } from "../../viewmodels";

export interface DesktopProps extends Props {
  cardSets: Array<CardSetViewmodel>;
  symbolSvgs: Map<string, string>;
  languages: Array<DtoLanguage>;
  // TODO add initial theme depending on host settings or configuration
}
