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
            <ButtonGroup minimal={true} className="language-button-bar" >
              {
                props.cardLanguages.map((language: DtoCardLanguage) => {
                  const languageDef = languages.find((lng: DtoLanguage) => lng.id == language.lang);
                  const label = languageDef ? languageDef.button_text : language.lang;
                  const tooltip = languageDef ? languageDef.display_text : language.lang;
                  return (
                    <LanguageButtonBarButton
                      label={label}
                      isCurrentLanguage={language.lang === props.currentLanguage}
                      tooltip={<span>{tooltip}</span>}
                      language={language}
                      onButtonClick={onAnyButtonClick}
                      key={language.lang}
                    />
                  );
                })
              }
            </ButtonGroup>
          )}
        </LanguagesContext.Consumer>

  );
  //#endregion
}
