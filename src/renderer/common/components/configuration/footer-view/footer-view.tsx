import { Button, DialogFooter } from "@blueprintjs/core";
import * as React from "react";

import { FooterViewProps } from "./footer-view.props";


export function FooterView(props: FooterViewProps) {

  //#region Main --------------------------------------------------------------
  return (
    <DialogFooter actions={renderActions()}>
    </DialogFooter>
  );
  //#endregion

  //#region Auxiliary methods -------------------------------------------------
  function renderActions(): React.JSX.Element {
    return (
      <>
        <Button icon="floppy-disk" disabled={!props.configuration.hasChanges} onClick={() => props.onSave(props.configuration)}>Save</Button>
        <Button icon="cross" onClick={props.onCancel}>Cancel</Button>
      </>
    );
  }
  //#endregion
}
