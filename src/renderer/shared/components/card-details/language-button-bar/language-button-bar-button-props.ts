import { Props } from "@blueprintjs/core";
import { MtgCardLanguageDto } from "../../../../../common/dto";

export interface LanguageButtonBarButtonProps extends Props {
  language: MtgCardLanguageDto;
  label: string;
  tooltip: React.JSX.Element;
  isCurrentLanguage: boolean;
  onButtonClick: (language: MtgCardLanguageDto) => void;
}
