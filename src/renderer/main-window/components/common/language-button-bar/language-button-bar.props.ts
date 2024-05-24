import { Props } from "@blueprintjs/core";

import { DtoLanguage } from "../../../../../common/dto";
import { MTGLanguage } from "../../../../../common/enums";

export interface LanguageButtonBarProps extends Props {
  cardLanguages: Array<MTGLanguage>;
  languages: Array<DtoLanguage>;
}
