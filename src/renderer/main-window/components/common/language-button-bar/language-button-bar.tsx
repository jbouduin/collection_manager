import { ButtonGroup, SectionCard } from "@blueprintjs/core";
import * as React from "react";

import { DtoLanguage } from "../../../../../common/dto";
import { MTGLanguage } from "../../../../../common/enums";
import { LanguageButtonBarButton } from "./language-button-bar-button";
import { LanguageButtonBarProps } from "./language-button-bar.props";

export function LanguageButtonBar(props: LanguageButtonBarProps) {
  //#region Event handling ----------------------------------------------------
  function onAnyButtonClick(language: MTGLanguage): void {
    console.log("clicked", language);
  }
  //#endregion

  //#region Main block --------------------------------------------------------
  return (
    <SectionCard padded={true} className={props.className}>
      <ButtonGroup className={props.className} minimal={true} >
        {
          props.cardLanguages.map((language: MTGLanguage) => {
            const languageDef = props.languages.filter((lng: DtoLanguage) => lng.id == language);
            const label = languageDef.length > 0 ? languageDef[0].button_text : language;
            const tooltip = languageDef.length > 0 ? languageDef[0].display_text : language;
            return (
              <LanguageButtonBarButton
                label={label}
                tooltip={< span > {tooltip}</span>}
                language={language}
                onButtonClick={onAnyButtonClick}
                className={props.className}
                key={language}
              />
            );
          })
        }
      </ButtonGroup>
    </SectionCard>
  );
  //#endregion
}
