import { Button, DialogFooter, HTMLTable, NumericInput } from "@blueprintjs/core";
import { clone, cloneDeep, noop } from "lodash";
import * as React from "react";
import { OwnedCardQuantityDto } from "../../../../../common/dto";
import { CardCondition } from "../../../../../common/types";
import { IpcProxyService, IpcProxyServiceContext } from "../../../../common/context";
import { CardConditionViewmodel, OwnedCardQuantityViewmodel } from "../../../viewmodels";
import { CardConditionContext } from "../../context";
import { OwnedCardTableProps } from "./own-card-table.props";

export function OwnedCardTable(props: OwnedCardTableProps) {
  //#region State -------------------------------------------------------------
  const [state, setState] = React.useState<Array<OwnedCardQuantityViewmodel>>(new Array<OwnedCardQuantityViewmodel>());
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
          .then((r: Array<OwnedCardQuantityDto>) => setState(buildState(cardConditionContext, r)));
      } else {
        void ipcProxyService
          .getData<Array<OwnedCardQuantityDto>>(`/card/${props.cardId}/collection`)
          .then((r: Array<OwnedCardQuantityDto>) => setState(r.map((qty: OwnedCardQuantityDto) => new OwnedCardQuantityViewmodel(qty))));
      }
    },
    [props.cardId, props.collectionId]
  );
  //#endregion

  //#region Event handling ----------------------------------------------------
  function onCancel(): void {
    const newState = cloneDeep(state);
    newState.forEach((vm: OwnedCardQuantityViewmodel) => vm.cancelChanges());
    setState(newState);
  }

  function onSave(): void {
    ipcProxyService.postData<Array<OwnedCardQuantityDto>, Array<OwnedCardQuantityDto>>(
      `/collection/${props.collectionId}/card/${props.cardId}`,
      state.filter((vm: OwnedCardQuantityViewmodel) => vm.hasChanges).map((vm: OwnedCardQuantityViewmodel) => vm.dto)
    )
      .then(
        (saved: Array<OwnedCardQuantityDto>) => {
          const newState = clone(state);
          if (saved) {
            saved.forEach((dto: OwnedCardQuantityDto) => {
              const idx = newState.findIndex((vm: OwnedCardQuantityViewmodel) => vm.conditionId == dto.condition_id && vm.isFoil == dto.is_foil);
              newState[idx] = new OwnedCardQuantityViewmodel(dto);
            });
            setState(newState);
          }
        },
        (_saved: Array<OwnedCardQuantityDto>) => noop
      );
  }
  //#endregion

  //#region Rendering ---------------------------------------------------------
  return (
    <>
      <HTMLTable
        bordered={false}
        compact={true}
        key="the_table"
        width="100%"
      >
        <thead>
          <tr>
            <td key="col1" style={{ paddingLeft: "0px" }}>Condition</td>
            <td key="col2" style={{ paddingLeft: "0px" }}>Non-Foil</td>
            <td key="col3" style={{ paddingLeft: "0px" }}>Foil</td>
          </tr>
        </thead>
        <tbody>
          {
            getTable(cardConditionContext)
          }
        </tbody>
      </HTMLTable >
      {
        props.collectionId &&
        <DialogFooter actions={renderActions()} key="the_footer" />
      }
    </>
  );

  function getTable(conditions: Array<CardConditionViewmodel>): Array<React.JSX.Element> {
    const table: Array<React.JSX.Element> = conditions
      .sort((a: CardConditionViewmodel, b: CardConditionViewmodel) => a.sequence - b.sequence)
      .map((condition: CardConditionViewmodel) => {
        return (
          <tr key={condition.id}>
            <td key="col1" style={{ paddingLeft: "0px" }}>{condition.expression}</td>
            {
              props.collectionId
                ? <td key="col2" style={{ paddingLeft: "0px" }}>{renderQuantityEditor(condition.code, false)}</td>
                : <td key="col2" style={{ paddingLeft: "0px" }}>{accumulateQuantities(condition.code, false)}</td>
            }
            {
              props.collectionId
                ? <td key="col3" style={{ paddingLeft: "0px" }}>{renderQuantityEditor(condition.code, true)}</td>
                : <td key="col3" style={{ paddingLeft: "0px" }}>{accumulateQuantities(condition.code, true)}</td>
            }
          </tr>
        );
      });
    return table;
  }

  function renderQuantityEditor(condition: CardCondition, foil: boolean): React.JSX.Element {
    const viewmodel: OwnedCardQuantityViewmodel = state.find((v: OwnedCardQuantityViewmodel) => v.conditionId == condition && v.isFoil == foil);
    return viewmodel
      ? (
        <NumericInput
          allowNumericCharactersOnly={true}
          buttonPosition="none"
          min={0}
          onValueChange={
            (value: number) => {
              const newState = cloneDeep(state);
              newState.find((v: OwnedCardQuantityViewmodel) => v.conditionId == condition && v.isFoil == foil).quantity = value;
              setState(newState);
            }
          }
          selectAllOnFocus={true}
          style={{ maxWidth: "50px", textAlign: "right" }}
          value={viewmodel.quantity}
        />
      )
      : undefined;
  }

  function renderActions(): React.JSX.Element {
    const disabled = state.findIndex((vm: OwnedCardQuantityViewmodel) => vm.hasChanges) < 0;
    return (
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
    );
  }
  //#endregion

  //#region Auxiliary methods -------------------------------------------------
  /*
   * this method will only be called if props.collectionId is null and the OwnedCardQuantity could have multiple maps
   */
  function accumulateQuantities(condition: CardCondition, foil: boolean): number {
    return state.filter((qty: OwnedCardQuantityViewmodel) => qty.isFoil == foil && qty.conditionId == condition)
      .reduce((previousValue: number, currentValue: OwnedCardQuantityViewmodel) => previousValue + currentValue.quantity, 0);
  }

  function buildState(conditions: Array<CardConditionViewmodel>, quantities: Array<OwnedCardQuantityDto>): Array<OwnedCardQuantityViewmodel> {
    const result: Array<OwnedCardQuantityViewmodel> = quantities.map((qty: OwnedCardQuantityDto) => new OwnedCardQuantityViewmodel(qty));
    conditions.forEach((condition: CardConditionViewmodel) => {
      [true, false].forEach((foil: boolean) => {
        const existing = quantities.find((qty: OwnedCardQuantityDto) => qty.condition_id == condition.id && qty.is_foil == foil);
        if (!existing) {
          const nonExisting: OwnedCardQuantityDto = {
            collectionMaps: [
              {
                created_at: undefined,
                modified_at: undefined,
                owned_card_id: 0,
                collection_id: props.collectionId,
                quantity: 100
              }
            ],
            id: 0,
            created_at: undefined,
            modified_at: undefined,
            card_id: props.cardId,
            condition_id: condition.id,
            is_foil: foil,
            comments: ""
          };
          result.push(new OwnedCardQuantityViewmodel(nonExisting));
        }
      });
    });
    return result;
  }
  //#endregion
}
