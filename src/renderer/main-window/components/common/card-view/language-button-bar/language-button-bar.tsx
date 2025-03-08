import { ButtonGroup } from "@blueprintjs/core";
import * as React from "react";
import { LanguageDto, MtgCardLanguageDto } from "../../../../../../common/dto";
import { LanguagesContext } from "../../../../../shared/context";
import { LanguageButtonBarButton } from "./language-button-bar-button";
import { LanguageButtonBarProps } from "./language-button-bar.props";


export function LanguageButtonBar(props: LanguageButtonBarProps) {
  //#region Event handling ----------------------------------------------------
  function onAnyButtonClick(language: MtgCardLanguageDto): void {
    props.onButtonClick(language);
  }
  //#endregion

  //#region Main block --------------------------------------------------------
  return (
    <LanguagesContext.Consumer >
      {
        (languages: Array<LanguageDto>) => (
          <ButtonGroup className="language-button-bar" minimal={true}>
            {
              props.cardLanguages.map((language: MtgCardLanguageDto) => {
                const languageDef = languages.find((lng: LanguageDto) => lng.id == language.lang);
                const label = languageDef ? languageDef.button_text : language.lang;
                const tooltip = languageDef ? languageDef.display_text : language.lang;
                return (
                  <LanguageButtonBarButton
                    isCurrentLanguage={language.lang === props.currentLanguage}
                    key={language.lang}
                    label={label}
                    language={language}
                    onButtonClick={onAnyButtonClick}
                    tooltip={<span>{tooltip}</span>}
                  />
                );
              })
            }
          </ButtonGroup>
        )
      }
    </LanguagesContext.Consumer>

  );
  //#endregion
}
