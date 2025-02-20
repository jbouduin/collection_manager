import * as React from "react";
import { CardConditionViewmodel } from "../../../viewmodels";
import { CardConditionContext } from "../../context";
import { OwnedCardQuantityProps } from "./owned-card-quantity.props";
import { HTMLTable } from "@blueprintjs/core";
import { IpcProxyService, IpcProxyServiceContext } from "../../../../common/context";
import { OwnedCardCollectionMapDto, OwnedCardQuantityDto } from "../../../../../common/dto";
import { CardCondition } from "../../../../../common/types";

export function OwnedCardQuantity(props: OwnedCardQuantityProps) {
  //#region State -------------------------------------------------------------
  const [state, setState] = React.useState<Array<OwnedCardQuantityDto>>(new Array<OwnedCardQuantityDto>());
  //#endregion

  //#region Context -----------------------------------------------------------
  const ipcProxyService = React.useContext<IpcProxyService>(IpcProxyServiceContext);
  //#endregion

  //#region Effects -----------------------------------------------------------
  React.useEffect(
    () => {
      if (props.collectionId) {
        void ipcProxyService
          .getData<Array<OwnedCardQuantityDto>>(`/collection/${props.collectionId}/card/${props.cardId}`)
          .then((r: Array<OwnedCardQuantityDto>) => setState(r));
      } else {
        void ipcProxyService
          .getData<Array<OwnedCardQuantityDto>>(`/card/${props.cardId}/collection`)
          .then((r: Array<OwnedCardQuantityDto>) => setState(r));
      }
    },
    [props.cardId, props.collectionId]
  );
  //#endregion

  //#region Rendering ---------------------------------------------------------
  return (
    <CardConditionContext.Consumer>
      {
        (conditions: Array<CardConditionViewmodel>) => (
          <HTMLTable
            bordered={false}
            compact={true}
            width="100%"
          >
            <thead>
              <td style={{ paddingLeft: "0px" }}>Condition</td>
              <td style={{ paddingLeft: "0px" }}>Non-Foil</td>
              <td style={{ paddingLeft: "0px" }}>Foil</td>
            </thead>
            <tbody>
              {
                getTable(conditions)
              }
            </tbody>
          </HTMLTable >
        )
      }
    </CardConditionContext.Consumer>
  );

  function getTable(conditions: Array<CardConditionViewmodel>): Array<React.JSX.Element> {
    const table: Array<React.JSX.Element> = conditions.map((condition: CardConditionViewmodel) => {
      return (
        <tr>
          <td style={{ paddingLeft: "0px" }}>{condition.expression}</td>
          <td style={{ paddingLeft: "0px" }}>{accumulateQuantities(state, condition.code, false)}</td>
          <td style={{ paddingLeft: "0px" }}>{accumulateQuantities(state, condition.code, true)}</td>
        </tr>
      );
    });
    return table;
  }
  //#endregion

  //#region Auxiliary methods -------------------------------------------------
  function accumulateQuantities(quantities: Array<OwnedCardQuantityDto>, condition: CardCondition, foil: boolean): number {
    return quantities.filter((qty: OwnedCardQuantityDto) => qty.is_foil == foil && qty.condition_id == condition)
      .map((qty: OwnedCardQuantityDto) => qty.collectionMaps)
      .flat(1)
      .map((qty: OwnedCardCollectionMapDto) => qty.quantity)
      .reduce((previousValue: number, currentValue: number) => previousValue + currentValue, 0);
  }
  //#endregion
}
