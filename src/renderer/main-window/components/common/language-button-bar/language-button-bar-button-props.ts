import { Props } from "@blueprintjs/core";
import { CardLanguageDto } from "../../../../../common/dto";

export interface LanguageButtonBarButtonProps extends Props {
  language: CardLanguageDto;
  label: string;
  tooltip: React.JSX.Element;
  isCurrentLanguage: boolean;
  onButtonClick: (language: CardLanguageDto) => void;
}
