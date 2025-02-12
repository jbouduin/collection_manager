import * as React from "react";

import { CollectionDialogProps } from "./collection-dialog.props";
import { CollectionViewmodel } from "../../../../../../viewmodels/collection/collection.viewmodel";
import { DtoRendererConfiguration } from "../../../../../../../../common/dto";
import { Button, Classes, Dialog, DialogBody, DialogFooter, FormGroup, IconName, InputGroup, SectionCard, TextArea } from "@blueprintjs/core";
import { ConfigurationContext } from "../../../../../../components/context";
import { handleStringChange } from "../../../../../../../common/utils";
import { cloneDeep } from "lodash";

export function CollectionDialog(props: CollectionDialogProps) {

  //#region State -------------------------------------------------------------
  const [collection, setCollection] = React.useState<CollectionViewmodel>(props.collection);
  //#endregion

  //#region Effect ------------------------------------------------------------
  React.useEffect(
    () => {
      if (props.collection) {
        console.log("effect", props.collection)
        setCollection(props.collection)
      }
    },
    [props.collection]
  )


  //#endregion

  //#region Main --------------------------------------------------------------
  return (
    <ConfigurationContext.Consumer>
      {
        (configuration: DtoRendererConfiguration) => (
          <Dialog
            icon={getIconName()}
            title={getTitle()}
            isOpen={props.isOpen}
            className={configuration.useDarkTheme ? Classes.DARK : ""}
          >
            <DialogBody>
              {collection && renderForm()}
            </DialogBody>
            <DialogFooter actions={renderActions()} />
          </Dialog>
        )
      }
    </ConfigurationContext.Consumer>
  );
  //#endregion

  //#region Auxiliary render methods ------------------------------------------
  function renderActions(): React.JSX.Element {
    return (
      <>
        <Button icon="floppy-disk" disabled={collection?.hasChanges ? false : true} onClick={() => props.onSave(collection)}>Save</Button>
        <Button icon="cross" onClick={props.onCancel}>Cancel</Button>
      </>
    );
  }

  function renderForm(): React.JSX.Element {
    return (
      <SectionCard padded={false}>
        <FormGroup label="Name" labelInfo="required" labelFor="collection-name" key="collection-name">
          <InputGroup
            id="collection-name"
            inputMode="text"
            value={collection.name}
            // rightElement={<Icon icon="folder-open" />}
            small={true}
            onChange={
              handleStringChange((value: string) => {
                const newViewmodel = cloneDeep(collection);
                newViewmodel.name = value;
                setCollection(newViewmodel);
              })
            }
          />
        </FormGroup>
        <FormGroup label="Description" labelFor="collection-description" key="collection-description">
          <TextArea
            fill={true}
            autoResize={true}
            onChange={handleStringChange((value: string) => {
              const newViewmodel = cloneDeep(collection);
              newViewmodel.description = value;
              setCollection(newViewmodel);
            })}
            value={collection.description ?? ""} />
        </FormGroup>
      </SectionCard>
    );
  }

  function getIconName(): IconName {
    if (props.collection) {
      if (props.collection.isFolder) {
        if (props.dialogAction == "create") {
          return "folder-new";
        } else {
          return "folder-close";
        }
      } else {
        return "document"
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
