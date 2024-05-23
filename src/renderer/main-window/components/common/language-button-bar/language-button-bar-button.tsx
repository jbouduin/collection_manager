import { Button, Tooltip } from "@blueprintjs/core";
import * as React from "react";

import { LanguageButtonBarButtonProps } from "./language-button-bar-button-props";

export function LanguageButtonBarButton(props: LanguageButtonBarButtonProps) {

  //#region Event handling ----------------------------------------------------
  function onButtonClick(): void {
    props.onButtonClick(props.language);
  }
  //#endregion

  return (
    <Tooltip
      {...props}
      content={props.tooltip}
      openOnTargetFocus={false}
      placement="bottom"
      usePortal={false}>
      <Button onClick={onButtonClick}>{props.label}</Button>
    </Tooltip>
  );
}
