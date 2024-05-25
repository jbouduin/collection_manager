import { Props } from "@blueprintjs/core";

import { DtoCardLanguage, DtoLanguage } from "../../../../../common/dto";
import { MTGLanguage } from "../../../../../common/enums";

export interface LanguageButtonBarProps extends Props {
  currentLanguage: MTGLanguage;
  cardLanguages: Array<DtoCardLanguage>;
  languages: Array<DtoLanguage>;
  onButtonClick: (languages: DtoCardLanguage) => void;
}
