import { Checkbox, Divider, FormGroup, H4, HTMLSelect, HTMLTable, NumericInput, SectionCard } from "@blueprintjs/core";
import * as React from "react";
import { ICatalogTypeDto } from "../../../../common/dto";
import { CardSyncType, ImageStatus, RulingSyncType, TimespanUnit } from "../../../../common/types";
import { DisplayValueService, DisplayValueServiceContext } from "../../context";
import { displayValueRecordToSelectOptions, handleBooleanChange, handleValueChange } from "../utils";
import { SyncParameterViewProps } from "./sync-parameter-view.props";

export function SyncParameterView(props: SyncParameterViewProps) {
  //#region Rendering --------------------------------------------------------------
  return (
    <DisplayValueServiceContext.Consumer>
      {
        (displayValueService: DisplayValueService) => (
          <SectionCard padded={false} >
            <H4>Cards</H4>
            <FormGroup label="Cards" labelFor="card-sync-type">
              <HTMLSelect
                id="card-sync-type"
                minimal={true}
                onChange={
                  handleValueChange((value: CardSyncType) => {
                    props.syncParam.cardSyncType = value;
                    props.onSyncParamChanged(props.syncParam);
                  })
                }
                options={displayValueRecordToSelectOptions(displayValueService.cardSyncTypeDisplayValues)}
                value={props.syncParam.cardSyncType}
              />
            </FormGroup>

            {
              props.syncParam.cardSyncType == "byImageStatus" &&
              <FormGroup key="sync-by-image-status">
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                  {
                    renderImageStatus(displayValueService)
                  }
                </div>
              </FormGroup>
            }
            {
              props.syncParam.cardSyncType == "byLastSynchronized" &&
              <FormGroup key="sync-by-last-sync">
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <NumericInput
                    allowNumericCharactersOnly={true}
                    buttonPosition="none"
                    min={0}
                    onValueChange={
                      (value: number) => {
                        props.syncParam.syncCardsSyncedBeforeNumber = value;
                        props.onSyncParamChanged(props.syncParam);
                      }
                    }
                    selectAllOnFocus={true}
                    style={{ maxWidth: "50px", textAlign: "right" }}
                    value={props.syncParam.syncCardsSyncedBeforeNumber}
                  />
                  <HTMLSelect
                    minimal={true}
                    onChange={
                      handleValueChange((value: TimespanUnit) => {
                        props.syncParam.syncCardsSyncedBeforeUnit = value;
                        props.onSyncParamChanged(props.syncParam);
                      })
                    }
                    options={displayValueRecordToSelectOptions(displayValueService.timespanUnitDisplayValues)}
                    value={props.syncParam.syncCardsSyncedBeforeUnit}
                  />
                </div>
              </FormGroup>
            }

            <FormGroup label="Rulings" labelFor="rulings-sync-type">
              <HTMLSelect
                id="rulings-sync-type"
                minimal={true}
                onChange={
                  handleValueChange((value: RulingSyncType) => {
                    props.syncParam.rulingSyncType = value;
                    props.onSyncParamChanged(props.syncParam);
                  })
                }
                options={displayValueRecordToSelectOptions(displayValueService.rulingSyncTypeDisplayValues)}
                value={props.syncParam.rulingSyncType}
              />
            </FormGroup>

            <Divider className="ruling-divider" key="divider" />

            <H4>Master data</H4>
            <Checkbox
              checked={props.syncParam.syncCardSets}
              key="card-sets"
              label="Card set data"
              onChange={
                handleBooleanChange((value: boolean) => {
                  props.syncParam.syncCardSets = value;
                  props.onSyncParamChanged(props.syncParam);
                })
              }
            />
            <Checkbox
              checked={props.syncParam.syncCardSymbols}
              key="card-symbols"
              label="Card symbols"
              onChange={
                handleBooleanChange((value: boolean) => {
                  props.syncParam.syncCardSymbols = value;
                  props.onSyncParamChanged(props.syncParam);
                })
              }
            />
            <HTMLTable
              bordered={false}
              compact={true}
              key="catalogs"
              width="100%"
            >
              <thead>
                <tr><td colSpan={3} style={{ paddingLeft: "0px" }}>Catalogs</td></tr>
              </thead>
              <tbody>
                {
                  renderCatalogs()
                }
              </tbody>
            </HTMLTable >
          </SectionCard>
        )
      }
    </DisplayValueServiceContext.Consumer>
  );

  function renderCatalogs(): Array<React.JSX.Element> {
    const table = new Array<React.JSX.Element>();
    let currentRow: Array<React.JSX.Element>;
    let idx = 0;
    props.catalogs.forEach((catalog: ICatalogTypeDto) => {
      if (idx % 2 == 0) {
        currentRow = new Array<React.JSX.Element>();
      }

      currentRow.push((
        <td key={`cell-${catalog.catalog_name}`} style={{ paddingLeft: "0px" }} >
          <Checkbox
            checked={props.syncParam.getCatalogToSync(catalog.catalog_name)}
            key={catalog.catalog_name}
            labelElement={(
              <>
                {catalog.display_label} <small>(last synced: {catalog.last_synced_at ? catalog.last_synced_at.toLocaleString() : "Never"})</small>
              </>
            )}
            onChange={
              handleBooleanChange((value: boolean) => {
                props.syncParam.setCatalogToSync(catalog.catalog_name, value);
                props.onSyncParamChanged(props.syncParam);
              })
            }
          />
        </td>
      ));
      if (idx % 2 == 1) {
        table.push((
          <tr key={`row-${idx}`}>
            {currentRow}
          </tr>
        ));
        currentRow = undefined;
      }
      idx = idx + 1;
    });
    if (currentRow) {
      table.push((
        <tr key={`row-${idx}`}>
          {currentRow}
        </tr>
      ));
    }
    return table;
  }

  function renderImageStatus(displayValueService: DisplayValueService): Array<React.JSX.Element> {
    const result = new Array<React.JSX.Element>();

    Object.keys(displayValueService.imageStatusDisplayValues).forEach((key: ImageStatus) => {
      if (displayValueService.imageStatusDisplayValues[key]) {
        result.push((
          <Checkbox
            checked={props.syncParam.getCardImageStatusToSync(key)}
            key={key}
            label={displayValueService.imageStatusDisplayValues[key]}
            onChange={
              handleBooleanChange((value: boolean) => {
                props.syncParam.setCardImageStatusToSync(key, value);
                props.onSyncParamChanged(props.syncParam);
              })
            }
          />
        ));
      }
    });
    return result;
  }
  //#endregion
}
