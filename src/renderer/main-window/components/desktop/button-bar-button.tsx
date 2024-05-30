import { Button, Tooltip } from "@blueprintjs/core";
import * as React from "react";

import { ButtonBarButtonProps } from "./button-bar-button.props";


export function ButtonBarButton(props: ButtonBarButtonProps) {

  //#region Event handling ----------------------------------------------------
  function onButtonClick(): void {
    props.onButtonClick(props.desktopView);
  }
  //#endregion

  //#region Main --------------------------------------------------------------
  return (
    <Tooltip
      key={props.desktopView}
      content={props.tooltip}
      openOnTargetFocus={false}
      placement="right"
      usePortal={false}>
      <Button icon={props.iconName} onClick={onButtonClick}></Button>
    </Tooltip>
  );
  //#endregion
}
