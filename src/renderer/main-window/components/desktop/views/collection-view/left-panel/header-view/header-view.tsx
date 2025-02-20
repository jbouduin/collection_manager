import { Button, ButtonGroup, Menu, MenuItem, Popover } from "@blueprintjs/core";
import * as React from "react";
import { HeaderViewProps } from "./header-view.props";


// TODO currently not used
export function HeaderView(props: HeaderViewProps) {
  //#region Main --------------------------------------------------------------
  return (
    <ButtonGroup fill={true} minimal={true}>
      <Popover
        canEscapeKeyClose={true}
        content={
          <Menu small={true}>
            <MenuItem
              disabled={!props.canAddFolder}
              onClick={() => props.onAddFolder()}
              roleStructure="menuitem"
              text="Create Folder"
            />
            <MenuItem
              disabled={!props.canAddCollection}
              onClick={() => props.onAddCollection()}
              roleStructure="menuitem"
              text="Create Collection"
            />
          </Menu>
        }
        inheritDarkTheme={true}
        interactionKind="hover"
        key="add_menu"
        minimal={false}
        modifiers={
          { arrow: { enabled: false } }
        }
        openOnTargetFocus={false}
        placement="bottom-end"
        usePortal={false}
      >
        <Button
          disabled={!props.canAddCollection && !props.canAddFolder}
          icon="add"
        />
      </Popover>
      <Button
        disabled={!props.canEdit}
        icon="edit"
        onClick={() => props.onEdit()}
      />
      <Button
        disabled={!props.canDelete}
        icon="delete"
        onClick={() => props.onDelete()}
      />
    </ButtonGroup>
  );
  //#endregion
}
