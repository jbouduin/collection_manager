import { Props } from "@blueprintjs/core";
import { IMtgCardLanguageDto } from "../../../../../common/dto";
import { MtgLanguage } from "../../../../../common/types";

export interface LanguageButtonBarProps extends Props {
  currentLanguage: MtgLanguage;
  cardLanguages: Array<IMtgCardLanguageDto>;
  onButtonClick: (languages: IMtgCardLanguageDto) => void;
}
