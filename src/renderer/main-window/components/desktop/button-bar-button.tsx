import { Button, Tooltip } from "@blueprintjs/core";
import * as React from "react";

import { ButtonBarButtonProps } from "./button-bar-button.props";


export function ButtonBarButton(props: ButtonBarButtonProps) {
  console.log("in buttonbarbutton function");

  //#region Event handling ----------------------------------------------------
  function onButtonClick(): void {
    props.onButtonClick(props.desktopView);
  }
  //#endregion

  //#region Main --------------------------------------------------------------
  return (
    <div><Tooltip
      {...props}
      content={props.tooltip}
      openOnTargetFocus={false}
      placement="right"
      usePortal={false}>
      <Button icon={props.iconName} onClick={onButtonClick}></Button>
    </Tooltip>
    </div>
  );
  //#endregion
}
