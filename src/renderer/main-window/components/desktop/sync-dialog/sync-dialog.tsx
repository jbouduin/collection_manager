import { Button, Dialog, DialogBody, DialogFooter } from "@blueprintjs/core";
import * as React from "react";

import { ThemeContext } from "../../context";
import { SyncDialogProps } from "./sync-dialog.props";

export function SyncDialog(props: SyncDialogProps) {
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
            canOutsideClickClose={false}
            isCloseButtonShown={true}
            title="Synchronize"
            className={theme}
          >
            <DialogBody>Body</DialogBody>
            <DialogFooter actions={renderActions()} />
          </Dialog>
        )
      }
    </ThemeContext.Consumer>
  );
  //#endregion

  //#region Auxiliary render methods ------------------------------------------
  function renderActions(): React.JSX.Element {
    return (
      <>
        <Button onClick={() => props.onDialogClose()}>Cancel</Button>
        <Button intent="primary" onClick={() => props.onOkClick()}>OK</Button>
      </>
    );
  }
  //#endregion
}
