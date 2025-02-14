import { Props } from "@blueprintjs/core";
import { DtoCardLanguageDto } from "../../../../../common/dto";
import { MTGLanguage } from "../../../../../common/types";

export interface LanguageButtonBarProps extends Props {
  currentLanguage: MTGLanguage;
  cardLanguages: Array<DtoCardLanguageDto>;
  onButtonClick: (languages: DtoCardLanguageDto) => void;
}
