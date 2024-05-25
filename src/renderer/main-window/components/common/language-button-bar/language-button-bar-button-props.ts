import { Props } from "@blueprintjs/core";

import { DtoCardLanguage } from "../../../../../common/dto";

export interface LanguageButtonBarButtonProps extends Props {
  language: DtoCardLanguage;
  label: string;
  tooltip: React.JSX.Element;
  isCurrentLanguage: boolean;
  onButtonClick: (language: DtoCardLanguage) => void;
}
