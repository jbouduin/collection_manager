import { Props } from "@blueprintjs/core";

import { MTGLanguage } from "../../../../../common/enums";

export interface LanguageButtonBarButtonProps extends Props {
  language: MTGLanguage;
  label: string;
  tooltip: React.JSX.Element;
  onButtonClick: (language: MTGLanguage) => void;
}
