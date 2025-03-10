import { Button, DialogFooter } from "@blueprintjs/core";
import { cloneDeep, noop } from "lodash";
import * as React from "react";
import { OwnedCardQuantityDto } from "../../../../../common/dto";
import { CardCondition } from "../../../../../common/types";
import { IpcProxyService, IpcProxyServiceContext } from "../../../../common/context";
import { CardConditionViewmodel, OwnedCardQuantityViewmodel } from "../../../viewmodels";
import { CardConditionContext } from "../../context";
import { buildEditableState } from "./build-editable-state";
import { OwnedCardPanelProps } from "./own-card-panel.props";
import { OwnedCardTable } from "./own-card-table";
import { OwnedCardDialog } from "./owned-card-dialog";

export function OwnedCardPanel(props: OwnedCardPanelProps) {
  //#region State -------------------------------------------------------------
  const [state, setState] = React.useState<Array<OwnedCardQuantityViewmodel>>(new Array<OwnedCardQuantityViewmodel>());
  const [showDialog, setShowDialog] = React.useState<boolean>(false);
  //#endregion

  //#region Context -----------------------------------------------------------
  const ipcProxyService = React.useContext<IpcProxyService>(IpcProxyServiceContext);
  const cardConditionContext = React.useContext<Array<CardConditionViewmodel>>(CardConditionContext);
  //#endregion

  //#region Effects -----------------------------------------------------------
  React.useEffect(
    () => {
      // if there is a collectionId -> the table is editable
      if (props.collectionId) {
        void ipcProxyService
          .getData<Array<OwnedCardQuantityDto>>(`/collection/${props.collectionId}/card/${props.cardId}`)
          .then((r: Array<OwnedCardQuantityDto>) => setState(buildEditableState(cardConditionContext, props.cardId, props.collectionId, r)));
      } else {
        void ipcProxyService
          .getData<Array<OwnedCardQuantityDto>>(`/card/${props.cardId}/collection`)
          .then((r: Array<OwnedCardQuantityDto>) => setState(r.map((qty: OwnedCardQuantityDto) => new OwnedCardQuantityViewmodel(qty))));
      }
    },
    [props.cardId, props.collectionId]
  );
  //#endregion

  //#region Eventhandling -------------------------------------------------------
  function onQuantityChanged(conditionId: CardCondition, isFoil: boolean, newQuantity: number): void {
    const newState = cloneDeep(state);
    newState.find((v: OwnedCardQuantityViewmodel) => v.conditionId == conditionId && v.isFoil == isFoil).quantity = newQuantity;
    setState(newState);
  }

  function onSave(): void {
    ipcProxyService.postData<Array<OwnedCardQuantityDto>, Array<OwnedCardQuantityDto>>(
      `/collection/${props.collectionId}/card/${props.cardId}`,
      state.filter((vm: OwnedCardQuantityViewmodel) => vm.hasChanges).map((vm: OwnedCardQuantityViewmodel) => vm.dto)
    )
      .then(
        (saved: Array<OwnedCardQuantityDto>) => {
          if (saved) {
            setState(buildEditableState(cardConditionContext, props.cardId, props.collectionId, saved));
          }
        },
        (_saved: Array<OwnedCardQuantityDto>) => noop
      );
  }

  function onCancel(): void {
    const newState = cloneDeep(state);
    newState.forEach((vm: OwnedCardQuantityViewmodel) => vm.cancelChanges());
    setState(newState);
  }

  function onEdit(): void {
    setShowDialog(true);
  }

  function onDialogClose(quantities: Array<OwnedCardQuantityDto>): void {
    if (quantities) {
      setState(quantities.map((qty: OwnedCardQuantityDto) => new OwnedCardQuantityViewmodel(qty)));
    }
    setShowDialog(false);
  }
  //#endregion

  //#region rendering ---------------------------------------------------------
  return (
    <>
      <OwnedCardTable
        onQuantityChanged={onQuantityChanged}
        quantities={state}
        readOnly={props.collectionId == null}
      />
      <DialogFooter actions={renderActions()} key="the_footer" />
      {showDialog && <OwnedCardDialog cardId={props.cardId} onClose={onDialogClose} />}
    </>
  );

  function renderActions(): React.JSX.Element {
    const disabled = state.findIndex((vm: OwnedCardQuantityViewmodel) => vm.hasChanges) < 0;
    return (
      props.collectionId
        ? (
          <>
            <Button
              disabled={disabled}
              icon="floppy-disk"
              onClick={onSave}
            >
              Save
            </Button>
            <Button
              disabled={disabled}
              icon="cross"
              onClick={onCancel}
            >
              Discard changes
            </Button>
          </>
        )
        : (
          <Button
            icon="edit"
            onClick={onEdit}
          >
            Edit
          </Button>
        )
    );
  }
  //#endregion
}
