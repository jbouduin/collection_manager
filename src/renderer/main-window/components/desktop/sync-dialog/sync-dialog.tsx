import { Button, Classes, Dialog, DialogBody, DialogFooter } from "@blueprintjs/core";
import { cloneDeep } from "lodash";
import * as React from "react";

import { SyncParameterView } from "../../../../common/components/sync-parameter-view/sync-parameter-view";
import { SyncParamViewmodel } from "../../../../common/viewmodels/sync-param/sync-param.viewmodel";
import { ConfigurationContext } from "../../context";
import { SyncDialogProps } from "./sync-dialog.props";
import { DtoRendererConfiguration } from "../../../../../common/dto";

export function SyncDialog(props: SyncDialogProps) {
  //#region State -------------------------------------------------------------
  const initialState = new SyncParamViewmodel({
    catalogTypesToSync: [],
    syncCardSymbols: false,
    syncCardSets: false,
    rulingSyncType: "none",
    cardSyncType: "none",
    cardSelectionToSync: [],
    cardImageStatusToSync: [],
    syncCardsSyncedBeforeNumber: 1,
    syncCardsSyncedBeforeUnit: "month",
    cardSetCodeToSyncCardsFor: undefined,
    changedImageStatusAction: "delete"
  });
  const [syncParam, setSyncParam] = React.useState<SyncParamViewmodel>(initialState);
  //#endregion

  //#region Event handling ----------------------------------------------------
  function onSyncParamChanged(syncParam: SyncParamViewmodel): void {
    const newState = cloneDeep(syncParam);
    setSyncParam(newState);
  }
  //#endregion

  //#region Main --------------------------------------------------------------
  return (
    <ConfigurationContext.Consumer>
      {
        (configuration: DtoRendererConfiguration) => (
          <Dialog
            style={{ width: "800px" }}
            isOpen={props.isOpen}
            onClose={() => props.onDialogClose()}
            shouldReturnFocusOnClose={true}
            canEscapeKeyClose={true}
            canOutsideClickClose={false}
            isCloseButtonShown={true}
            title="Synchronize"
            className={configuration.useDarkTheme ? Classes.DARK : ""}
          >
            <DialogBody>
              <SyncParameterView
                syncParam={syncParam}
                onSyncParamChanged={onSyncParamChanged}
              />
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
        <Button onClick={() => props.onDialogClose()}>Cancel</Button>
        <Button intent="primary" onClick={() => props.onOkClick(syncParam.dto)}>OK</Button>
      </>
    );
  }
  //#endregion
}
