import { ButtonGroup } from "@blueprintjs/core";
import * as React from "react";
import { DtoCardLanguage, DtoLanguage } from "../../../../../common/dto";
import { LanguagesContext } from "../../context";
import { LanguageButtonBarButton } from "./language-button-bar-button";
import { LanguageButtonBarProps } from "./language-button-bar.props";

export function LanguageButtonBar(props: LanguageButtonBarProps) {
  //#region Event handling ----------------------------------------------------
  function onAnyButtonClick(language: DtoCardLanguage): void {
    props.onButtonClick(language);
  }
  //#endregion

  //#region Main block --------------------------------------------------------
  return (
    <LanguagesContext.Consumer >
      {
        (languages: Array<DtoLanguage>) => (
          <ButtonGroup className="language-button-bar" minimal={true}>
            {
              props.cardLanguages.map((language: DtoCardLanguage) => {
                const languageDef = languages.find((lng: DtoLanguage) => lng.id == language.lang);
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
