import { Button, Classes, Dialog, DialogBody, DialogFooter, FormGroup, IconName, InputGroup, SectionCard, TextArea } from "@blueprintjs/core";
import { cloneDeep } from "lodash";
import * as React from "react";
import { RendererConfigurationDto } from "../../../../../../../../common/dto";
import { handleStringChange } from "../../../../../../../common/utils";
import { ConfigurationContext } from "../../../../../../components/context";
import { CollectionViewmodel } from "../../../../../../viewmodels/collection/collection.viewmodel";
import { CollectionDialogProps } from "./collection-dialog.props";

export function CollectionDialog(props: CollectionDialogProps) {
  //#region State -------------------------------------------------------------
  const [collection, setCollection] = React.useState<CollectionViewmodel>(props.collection);
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
    <ConfigurationContext.Consumer>
      {
        (configuration: RendererConfigurationDto) => (
          <Dialog
            className={configuration.useDarkTheme ? Classes.DARK : ""}
            icon={getIconName()}
            isOpen={props.isOpen}
            title={getTitle()}
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
            // rightElement={<Icon icon="folder-open" />}
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

  function getIconName(): IconName {
    if (props.collection) {
      if (props.collection.isFolder) {
        if (props.dialogAction == "create") {
          return "folder-new";
        } else {
          return "folder-close";
        }
      } else {
        return "document";
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
