import { Props } from "@blueprintjs/core";
import { DtoCardLanguage } from "../../../../../common/dto";
import { MTGLanguage } from "../../../../../common/types";

export interface LanguageButtonBarProps extends Props {
  currentLanguage: MTGLanguage;
  cardLanguages: Array<DtoCardLanguage>;
  onButtonClick: (languages: DtoCardLanguage) => void;
}
