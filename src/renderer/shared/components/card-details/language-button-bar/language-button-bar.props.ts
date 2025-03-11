import { Props } from "@blueprintjs/core";
import { MtgCardLanguageDto } from "../../../../../common/dto";
import { MtgLanguage } from "../../../../../common/types";

export interface LanguageButtonBarProps extends Props {
  currentLanguage: MtgLanguage;
  cardLanguages: Array<MtgCardLanguageDto>;
  onButtonClick: (languages: MtgCardLanguageDto) => void;
}
