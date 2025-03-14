import { Button, Dialog, DialogBody, DialogFooter } from "@blueprintjs/core";
import { cloneDeep } from "lodash";
import * as React from "react";
import { ICatalogTypeDto, IScryfallBulkDataItemDto } from "../../../../../common/dto";
import { SyncParameterView } from "../../../../shared/components/sync-parameter-view";
import { IIpcProxyService, IpcProxyServiceContext } from "../../../../shared/context";
import { SyncParamViewmodel } from "../../../../shared/viewmodels";
import { SyncDialogProps } from "./sync-dialog.props";


export function SyncDialog(props: SyncDialogProps) {
  //#region State -------------------------------------------------------------
  const initialState = new SyncParamViewmodel({
    catalogTypesToSync: [],
    bulkSyncUrl: null,
    syncCardSymbols: false,
    syncCardSets: false,
    rulingSyncType: "none",
    cardSyncType: "none",
    cardSelectionToSync: [],
    cardImageStatusToSync: [],
    syncCardsSyncedBeforeNumber: 1,
    syncCardsSyncedBeforeUnit: "month",
    cardSetCodeToSyncCardsFor: null,
    changedImageStatusAction: "delete",
    oracleId: null
  });
  const [syncParam, setSyncParam] = React.useState<SyncParamViewmodel>(initialState);
  const [catalogs, setCatalogs] = React.useState<Array<ICatalogTypeDto>>(new Array<ICatalogTypeDto>());
  const [bulkOptions, setBulkOptions] = React.useState<Array<IScryfallBulkDataItemDto>>(new Array<IScryfallBulkDataItemDto>());
  //#endregion

  //#region Context -----------------------------------------------------------
  const ipcProxyService = React.useContext<IIpcProxyService>(IpcProxyServiceContext);
  //#endregion

  //#region Effects -----------------------------------------------------------
  React.useEffect(
    () => {
      void ipcProxyService.getData<Array<ICatalogTypeDto>>("/catalog").then(
        (r: Array<ICatalogTypeDto>) => setCatalogs(r),
        (_r: Error) => setCatalogs(new Array<ICatalogTypeDto>())
      );
    },
    []
  );

  React.useEffect(
    () => {
      void ipcProxyService.getData<Array<IScryfallBulkDataItemDto>>("/mtg-sync/bulk").then(
        (r: Array<IScryfallBulkDataItemDto>) => {
          setBulkOptions(r.filter((o: IScryfallBulkDataItemDto) => o.type != "rulings"));
          const newState = cloneDeep(syncParam);
          newState.setBulkDefinition(r.find((o: IScryfallBulkDataItemDto) => o.type == "default_cards"));
          setSyncParam(newState);
        },
        (_r: Error) => setBulkOptions(new Array<IScryfallBulkDataItemDto>())
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
          isConfigurationView={false}
          onSyncParamChanged={onSyncParamChanged}
          scryfallBulkItems={bulkOptions}
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
