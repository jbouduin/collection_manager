import { Props } from "@blueprintjs/core";

import { DtoCardLanguageDto } from "../../../../../common/dto";

export interface LanguageButtonBarButtonProps extends Props {
  language: DtoCardLanguageDto;
  label: string;
  tooltip: React.JSX.Element;
  isCurrentLanguage: boolean;
  onButtonClick: (language: DtoCardLanguageDto) => void;
}
