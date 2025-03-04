import { Button, Dialog, DialogBody, DialogFooter } from "@blueprintjs/core";
import { cloneDeep } from "lodash";
import * as React from "react";
import { CatalogTypeDto } from "../../../../../common/dto";
import { SyncParameterView } from "../../../../shared/components";
import { IpcProxyService, IpcProxyServiceContext } from "../../../../shared/context";
import { SyncParamViewmodel } from "../../../../shared/viewmodels";
import { SyncDialogProps } from "./sync-dialog.props";


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
    changedImageStatusAction: "delete",
    oracleId: undefined
  });
  const [syncParam, setSyncParam] = React.useState<SyncParamViewmodel>(initialState);
  const [catalogs, setCatalogs] = React.useState<Array<CatalogTypeDto>>(new Array<CatalogTypeDto>());
  //#endregion

  //#region Context -----------------------------------------------------------
  const ipcProxyService = React.useContext<IpcProxyService>(IpcProxyServiceContext);
  //#endregion

  //#region Effects -----------------------------------------------------------
  React.useEffect(
    () => {
      void ipcProxyService.getData<Array<CatalogTypeDto>>("/catalog").then(
        (r: Array<CatalogTypeDto>) => setCatalogs(r),
        (_r: Error) => setCatalogs(new Array<CatalogTypeDto>())
      );
    },
    []
  );
  //#endregion

  //#region Event handling ----------------------------------------------------
  function onSyncParamChanged(syncParam: SyncParamViewmodel): void {
    const newState = cloneDeep(syncParam);
    setSyncParam(newState);
  }
  //#endregion

  //#region Main --------------------------------------------------------------
  return (
    <Dialog
      canEscapeKeyClose={true}
      canOutsideClickClose={false}
      className={props.className}
      isCloseButtonShown={true}
      isOpen={props.isOpen}
      onClose={() => props.onDialogClose()}
      shouldReturnFocusOnClose={true}
      style={{ width: "800px" }}
      title="Synchronize"
    >
      <DialogBody>
        <SyncParameterView
          catalogs={catalogs}
          onSyncParamChanged={onSyncParamChanged}
          syncParam={syncParam}
        />
      </DialogBody>
      <DialogFooter actions={renderActions()} />
    </Dialog>
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
