import { Props } from "@blueprintjs/core";

import { DtoCardLanguage } from "../../../../../common/dto";
import { MTGLanguage } from "../../../../../common/enums";

export interface LanguageButtonBarProps extends Props {
  currentLanguage: MTGLanguage;
  cardLanguages: Array<DtoCardLanguage>;
  onButtonClick: (languages: DtoCardLanguage) => void;
}
