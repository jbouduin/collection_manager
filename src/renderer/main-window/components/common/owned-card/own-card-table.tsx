import { HTMLTable, NumericInput } from "@blueprintjs/core";
import * as React from "react";
import { CardConditionDto } from "../../../../../common/dto";
import { CardCondition } from "../../../../../common/types";
import { OwnedCardQuantityViewmodel } from "../../../viewmodels";
import { CardConditionContext } from "../../../../shared/context";
import { OwnedCardTableProps } from "./own-card-table.props";

export function OwnedCardTable(props: OwnedCardTableProps) {
  //#region Context -----------------------------------------------------------
  const cardConditionContext = React.useContext<Array<CardConditionDto>>(CardConditionContext);
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
    </>
  );

  function getTable(conditions: Array<CardConditionDto>): Array<React.JSX.Element> {
    const table: Array<React.JSX.Element> = conditions
      .sort((a: CardConditionDto, b: CardConditionDto) => a.sequence - b.sequence)
      .map((condition: CardConditionDto) => {
        return (
          <tr key={condition.id}>
            <td key="col1" style={{ paddingLeft: "0px" }}>{condition.expression}</td>
            {
              props.readOnly
                ? <td key="col2" style={{ paddingLeft: "0px" }}>{accumulateQuantities(condition.id, false)}</td>
                : <td key="col2" style={{ paddingLeft: "0px" }}>{renderQuantityEditor(condition.id, false)}</td>
            }
            {
              props.readOnly
                ? <td key="col3" style={{ paddingLeft: "0px" }}>{accumulateQuantities(condition.id, true)}</td>
                : <td key="col3" style={{ paddingLeft: "0px" }}>{renderQuantityEditor(condition.id, true)}</td>
            }
          </tr>
        );
      });
    return table;
  }

  function renderQuantityEditor(condition: CardCondition, foil: boolean): React.JSX.Element {
    const viewmodel: OwnedCardQuantityViewmodel = props.quantities.find((v: OwnedCardQuantityViewmodel) => v.conditionId == condition && v.isFoil == foil);
    return viewmodel
      ? (
        <NumericInput
          allowNumericCharactersOnly={true}
          buttonPosition="none"
          min={0}
          onValueChange={(value: number) => props.onQuantityChanged(viewmodel.conditionId, viewmodel.isFoil, value)}
          selectAllOnFocus={true}
          style={{ maxWidth: "50px", textAlign: "right" }}
          value={viewmodel.quantity}
        />
      )
      : undefined;
  }
  //#endregion

  //#region Auxiliary methods -------------------------------------------------
  /*
   * this method will only be called if readonly and the OwnedCardQuantity could have multiple maps
   */
  function accumulateQuantities(condition: CardCondition, foil: boolean): number {
    return props.quantities
      .filter((qty: OwnedCardQuantityViewmodel) => qty.isFoil == foil && qty.conditionId == condition)
      .reduce((previousValue: number, currentValue: OwnedCardQuantityViewmodel) => previousValue + currentValue.quantity, 0);
  }
  //#endregion
}
