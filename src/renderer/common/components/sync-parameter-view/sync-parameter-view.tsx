import { Checkbox, Divider, FormGroup, H4, HTMLSelect, HTMLTable, NumericInput, SectionCard } from "@blueprintjs/core";
import * as React from "react";

import { CardSyncType, CardSyncTypeDisplayValue, RulingSyncType, RulingSyncTypeDisplayValue, TimespanUnit, TimespanUnitDisplayValue } from "../../../../common/dto";
import { CatalogType, CatalogTypeDisplayValue, ImageStatus, ImageStatusDisplayValue } from "../../../../common/enums";
import { displayValueMapToSelectOptions, handleBooleanChange, handleValueChange } from "../../utils";
import { SyncParameterViewProps } from "./sync-parameter-view.props";

export function SyncParameterView(props: SyncParameterViewProps) {

  //#region Select Item renderers ---------------------------------------------

  //#endregion

  //#region Main --------------------------------------------------------------
  return (
    <SectionCard padded={false} >
      <H4>Cards</H4>
      <FormGroup label="Cards" labelFor="card-sync-type">
        <HTMLSelect
          id="card-sync-type"
          options={displayValueMapToSelectOptions(CardSyncTypeDisplayValue)}
          value={props.syncParam.cardSyncType}
          onChange={
            handleValueChange((value: CardSyncType) => {
              props.syncParam.cardSyncType = value;
              props.onSyncParamChanged(props.syncParam);
            })
          }
        />
      </FormGroup>

      {
        props.syncParam.cardSyncType == "byImageStatus" &&
        <FormGroup key="sync-by-image-status">
          <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
            {
              renderImageStatus()
            }
          </div>
        </FormGroup>
      }

      {
        props.syncParam.cardSyncType == "byLastSynchronized" &&
        <FormGroup key="sync-by-last-sync">
          <div style={{ display: "flex", flexDirection: "row" }}>
            <NumericInput
              style={{ maxWidth: "50px", textAlign: "right" }}
              selectAllOnFocus={true}
              value={props.syncParam.syncCardsSyncedBeforeNumber}
              allowNumericCharactersOnly={true}
              buttonPosition="none"
              min={0}
              onValueChange={
                (value: number) => {
                  props.syncParam.syncCardsSyncedBeforeNumber = value;
                  props.onSyncParamChanged(props.syncParam);
                }
              }
            />
            <HTMLSelect
              options={displayValueMapToSelectOptions(TimespanUnitDisplayValue)}
              value={props.syncParam.syncCardsSyncedBeforeUnit}
              onChange={
                handleValueChange((value: TimespanUnit) => {
                  props.syncParam.syncCardsSyncedBeforeUnit = value;
                  props.onSyncParamChanged(props.syncParam);
                })
              }
            />
          </div>
        </FormGroup>
      }

      <FormGroup label="Rulings" labelFor="rulings-sync-type">
        <HTMLSelect
          id="rulings-sync-type"
          options={displayValueMapToSelectOptions(RulingSyncTypeDisplayValue)}
          value={props.syncParam.rulingSyncType}
          onChange={
            handleValueChange((value: RulingSyncType) => {
              props.syncParam.rulingSyncType = value;
              props.onSyncParamChanged(props.syncParam);
            })
          }
        />
      </FormGroup>

      <Divider className="ruling-divider" key="divider" />

      <H4>Master data</H4>
      {/* <FormGroup label="Master data" key="master-data"> */}
      {/* <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}> */}
      <Checkbox
        key="card-sets"
        label="Card set data"
        checked={props.syncParam.syncCardSets}
        onChange={
          handleBooleanChange((value: boolean) => {
            props.syncParam.syncCardSets = value;
            props.onSyncParamChanged(props.syncParam);
          })
        }
      />
      <Checkbox
        key="card-symbols"
        label="Card symbols"
        checked={props.syncParam.syncCardSymbols}
        onChange={
          handleBooleanChange((value: boolean) => {
            props.syncParam.syncCardSymbols = value;
            props.onSyncParamChanged(props.syncParam);
          })
        }
      />


      <HTMLTable compact={true} bordered={false} width="100%" key="catalogs">
        <thead>
          <tr><td colSpan={3} style={{ paddingLeft: "0px" }}>Catalogs</td></tr>
        </thead>
        <tbody>
          {
            x()
          }
        </tbody>
      </HTMLTable >
    </SectionCard>
  );
  //#endregion

  //#region Auxiliary methods -------------------------------------------------
  function x(): Array<React.JSX.Element> {
    const table = new Array<React.JSX.Element>();
    let currentRow: Array<React.JSX.Element>;
    let idx = 0;
    CatalogTypeDisplayValue.forEach((displayValue: string, key: CatalogType) => {
      if (idx % 3 == 0) {
        currentRow = new Array<React.JSX.Element>();
      }
      currentRow.push(
        (
          <td style={{paddingLeft: "0px"}} key={`cell-${key}`}>

            <Checkbox
              key={key}
              label={displayValue}
              checked={props.syncParam.getCatalogToSync(key)}
              onChange={
                handleBooleanChange((value: boolean) => {
                  props.syncParam.setCatalogToSync(key, value);
                  props.onSyncParamChanged(props.syncParam);
                })
              }
              />
          </td>
        )
      );
      if (idx % 3 == 1) {
        table.push(
          (
            <tr key={`row-${idx}`}>
              {currentRow}
            </tr>
          )
        );
      }
      idx = idx + 1;
    });
    return table;
  }

  function renderImageStatus(): Array<React.JSX.Element> {

    const result = new Array<React.JSX.Element>();
    ImageStatusDisplayValue.forEach((displayValue: string, key: ImageStatus) => {

      result.push(
        (
          <Checkbox
            key={key}
            label={displayValue}
            checked={props.syncParam.getCardImageStatusToSync(key)}
            onChange={
              handleBooleanChange((value: boolean) => {
                props.syncParam.setCardImageStatusToSync(key, value);
                props.onSyncParamChanged(props.syncParam);
              })
            }
          />
        )
      );
    });
    return result;
  }


  //#endregion
}
