import { Button, DialogFooter } from "@blueprintjs/core";
import * as React from "react";

import { FooterViewProps } from "./footer-view.props";


export function FooterView(props: FooterViewProps) {
  return (
    <DialogFooter actions={renderActions()}>
    </DialogFooter>
  );

  function renderActions(): React.JSX.Element {
    return (
      <>
      <Button icon="floppy-disk" disabled={!props.hasChanges} onClick={props.onSave}>Save</Button>
      <Button icon="cross" onClick={props.onCancel}>Cancel</Button>
      </>
    );
  }
}
