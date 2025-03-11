import { Button, Tooltip } from "@blueprintjs/core";
import * as React from "react";
import { LanguageButtonBarButtonProps } from "./language-button-bar-button-props";

export function LanguageButtonBarButton(props: LanguageButtonBarButtonProps) {
  //#region Event handling ----------------------------------------------------
  function onButtonClick(): void {
    props.onButtonClick(props.language);
  }
  //#endregion

  //#region Main --------------------------------------------------------------
  return (
    <Tooltip
      content={props.tooltip}
      openOnTargetFocus={false}
      placement="bottom"
      usePortal={false}
    >
      <Button
        className="language-button-bar-button"
        intent={props.isCurrentLanguage ? "primary" : "none"}
        onClick={onButtonClick}
      >
        {props.label}
      </Button>
    </Tooltip>
  );
  //#endregion
}
