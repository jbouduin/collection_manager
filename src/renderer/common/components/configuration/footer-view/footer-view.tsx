import { Button, DialogFooter } from "@blueprintjs/core";
import * as React from "react";
import { FooterViewProps } from "./footer-view.props";


export function FooterView(props: FooterViewProps) {
  //#region Rednering ---------------------------------------------------------
  return (
    <DialogFooter actions={renderActions()} />
  );

  function renderActions(): React.JSX.Element {
    return (
      <>
        <Button
          disabled={!props.configuration.hasChanges}
          icon="floppy-disk"
          onClick={() => props.onSave(props.configuration)}
        >
          Save
        </Button>
        <Button
          icon="cross"
          onClick={props.onCancel}
        >
          Cancel
        </Button>
      </>
    );
  }
  //#endregion
}
