import { Props } from "@blueprintjs/core";

import { DtoLanguage, RendererConfigurationDto } from "../../../../common/dto";
import { CardSetViewmodel } from "../../viewmodels";

export interface DesktopProps extends Props {
  cardSets: Array<CardSetViewmodel>;
  symbolSvgs: Map<string, string>;
  languages: Array<DtoLanguage>;
  configuration: RendererConfigurationDto;
}
