import { Props } from "@blueprintjs/core";
import { CardLanguageDto } from "../../../../../common/dto";
import { MTGLanguage } from "../../../../../common/types";

export interface LanguageButtonBarProps extends Props {
  currentLanguage: MTGLanguage;
  cardLanguages: Array<CardLanguageDto>;
  onButtonClick: (languages: CardLanguageDto) => void;
}
