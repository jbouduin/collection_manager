import { Dialog } from "@blueprintjs/core";
import classNames from "classnames";
import * as React from "react";
import { BaseDialogProps } from "../../../../common/components/base-dialog-props";
import { SplashContent } from "../../../../common/components/splash/splash-contents";

export function SplashScreen(props: BaseDialogProps) {
  return (

    <Dialog
      canEscapeKeyClose={true}
      canOutsideClickClose={false}
      className={classNames(props.className, "splash-window")}
      enforceFocus={true}
      isOpen={props.isOpen}
      onClose={props.onDialogClose}
      shouldReturnFocusOnClose={true}
    >
      <SplashContent />
    </Dialog>
  );
}
