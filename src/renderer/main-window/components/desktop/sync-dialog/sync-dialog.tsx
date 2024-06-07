import { Dialog, DialogBody, DialogFooter } from "@blueprintjs/core";
import * as React from "react";

import { ThemeContext } from "../../context";
import { BaseDialogProps } from "../../common/dialog-props";

export function SyncDialog(props: BaseDialogProps) {
  //#region Main --------------------------------------------------------------
  return (
    <ThemeContext.Consumer>
      {
        (theme: string) => (
          <Dialog
            isOpen={props.isOpen}
            onClose={() => props.onDialogClose()}
            shouldReturnFocusOnClose={true}
            canEscapeKeyClose={true}
            isCloseButtonShown={true}
            title="Settings"
            className={theme}
          >
            <DialogBody>Body</DialogBody>
            <DialogFooter>Footer</DialogFooter>
          </Dialog>
        )
      }
    </ThemeContext.Consumer>
  );
  //#endregion
}
