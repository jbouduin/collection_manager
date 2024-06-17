import { Button, ButtonGroup } from "@blueprintjs/core";
import { HeaderViewProps } from "./header-view.props";
import * as React from "react";


export function HeaderView(props: HeaderViewProps) {
  //#region Main --------------------------------------------------------------
  return (
    <ButtonGroup minimal={true} fill={true}>
      <Button icon="add" />
      <Button icon="edit" />
      <Button icon="delete" />

    </ButtonGroup>
  );
  //#endregion
}
