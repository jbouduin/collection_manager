import { Props } from "@blueprintjs/core";
import { MtgCardLanguageDto } from "../../../../../common/dto";
import { MTGLanguage } from "../../../../../common/types";

export interface LanguageButtonBarProps extends Props {
  currentLanguage: MTGLanguage;
  cardLanguages: Array<MtgCardLanguageDto>;
  onButtonClick: (languages: MtgCardLanguageDto) => void;
}
