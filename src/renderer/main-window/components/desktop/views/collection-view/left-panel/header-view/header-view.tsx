import { Button, ButtonGroup, IconName, Menu, MenuItem, Popover } from "@blueprintjs/core";
import { HeaderViewProps } from "./header-view.props";
import * as React from "react";

type PopoverKey = "add_menu" | "edit_menu" | "delete_menu";

export function HeaderView(props: HeaderViewProps) {
  console.log("in headerview function", props)
  //#region Main --------------------------------------------------------------
  return (
    <ButtonGroup minimal={true} fill={true}>
      <Popover key="add_menu"
        canEscapeKeyClose={true}
        inheritDarkTheme={true}
        interactionKind="hover"
        minimal={false}
        modifiers={
          { arrow: { enabled: false } }
        }
        content={
          <Menu small={true}>
            <MenuItem text="Create Folder" roleStructure="menuitem" onClick={() => props.onAddFolder()} disabled={!props.canAddFolder} />
            <MenuItem text="Create Collection" roleStructure="menuitem" onClick={() => props.onAddCollection()} disabled={!props.canAddCollection} />
          </Menu>
        }
        openOnTargetFocus={false}
        placement="bottom-end"
        usePortal={false}>
        <Button icon="add" disabled={!props.canAddCollection && !props.canAddFolder} />
      </Popover>
      <Button icon="edit" onClick={() => props.onEdit()} disabled={!props.canEdit} />
      <Button icon="delete" onClick={() => props.onDelete()} disabled={!props.canDelete} />

    </ButtonGroup>
  );
  //#endregion

  //#region Auxiliary methods -------------------------------------------------
  //#endregion

}
