import { Props } from "@blueprintjs/core";
import { IMtgCardLanguageDto } from "../../../../../common/dto";

export interface LanguageButtonBarButtonProps extends Props {
  language: IMtgCardLanguageDto;
  label: string;
  tooltip: React.JSX.Element;
  isCurrentLanguage: boolean;
  onButtonClick: (language: IMtgCardLanguageDto) => void;
}
