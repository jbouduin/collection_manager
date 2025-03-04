import { Button, Dialog, DialogBody, DialogFooter, FormGroup, Icon, InputGroup, SectionCard, TextArea } from "@blueprintjs/core";
import { cloneDeep } from "lodash";
import * as React from "react";
import { handleStringChange, SvgProvider } from "../../../../../../../shared/components";
import { CollectionTreeViewmodel } from "../../../../../../viewmodels";
import { CollectionDialogProps } from "./collection-dialog.props";

export function CollectionDialog(props: CollectionDialogProps) {
  //#region State -------------------------------------------------------------
  const [collection, setCollection] = React.useState<CollectionTreeViewmodel>(props.collection);
  //#endregion

  //#region Effect ------------------------------------------------------------
  React.useEffect(
    () => {
      if (props.collection) {
        setCollection(props.collection);
      }
    },
    [props.collection]
  );
  //#endregion

  //#region Main --------------------------------------------------------------
  return (
    <Dialog
      className={props.className}
      icon={getDialogIcon()}
      isOpen={props.isOpen}
      title={getTitle()}
    >
      <DialogBody>
        {collection && renderForm()}
      </DialogBody>
      <DialogFooter actions={renderActions()} />
    </Dialog>
  );
  //#endregion

  //#region Auxiliary render methods ------------------------------------------
  function renderActions(): React.JSX.Element {
    return (
      <>
        <Button
          disabled={collection?.hasChanges ? false : true}
          icon="floppy-disk"
          onClick={() => props.onSave(collection)}
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

  function renderForm(): React.JSX.Element {
    return (
      <SectionCard padded={false}>
        <FormGroup
          key="collection-name"
          label="Name"
          labelFor="collection-name"
          labelInfo="required"
        >
          <InputGroup
            id="collection-name"
            inputMode="text"
            onChange={
              handleStringChange((value: string) => {
                const newViewmodel = cloneDeep(collection);
                newViewmodel.name = value;
                setCollection(newViewmodel);
              })
            }
            small={true}
            value={collection.name}
          />
        </FormGroup>
        <FormGroup
          key="collection-description"
          label="Description"
          labelFor="collection-description"
        >
          <TextArea
            autoResize={true}
            fill={true}
            onChange={handleStringChange((value: string) => {
              const newViewmodel = cloneDeep(collection);
              newViewmodel.description = value;
              setCollection(newViewmodel);
            })}
            value={collection.description ?? ""}
          />
        </FormGroup>
      </SectionCard>
    );
  }

  function getDialogIcon(): React.JSX.Element {
    if (props.collection) {
      if (props.collection.isFolder) {
        if (props.dialogAction == "create") {
          return (<Icon icon="folder-new" />);
        } else {
          return (<Icon icon="folder-close" />);
        }
      } else {
        return (<SvgProvider svg={props.collectionSvg} />);
      }
    } else {
      return undefined;
    }
  }

  function getTitle(): string {
    if (props.collection) {
      if (props.collection.isFolder) {
        if (props.dialogAction == "create") {
          return "Create folder";
        } else {
          return "Edit folder";
        }
      } else {
        if (props.dialogAction == "create") {
          return "Create collection";
        } else {
          return "Edit collection";
        }
      }
    } else {
      return "";
    }
  }
  //#endregion
}
