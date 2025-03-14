import { Checkbox, Divider, FormGroup, H4, HTMLSelect, HTMLTable, NumericInput, SectionCard } from "@blueprintjs/core";
import * as React from "react";
import { ICatalogTypeDto, IScryfallBulkDataItemDto, ScryfallBulkDataType } from "../../../../common/dto";
import { CardSyncType, ImageStatus, RulingSyncType, TimespanUnit } from "../../../../common/types";
import { DisplayValueService, DisplayValueServiceContext } from "../../context";
import { displayValueRecordToSelectOptions, handleBooleanChange, handleValueChange } from "../utils";
import { SyncParameterViewProps } from "./sync-parameter-view.props";

export function SyncParameterView(props: SyncParameterViewProps) {
  //#region Memo --------------------------------------------------------------
  const cardSyncTypeDisplayValues = React.useMemo<Record<CardSyncType, string>>(
    () => {
      return {
        none: "Do not synchronize cards",
        allCards: "All cards which have previously been synchronized",
        byCardSet: undefined, // => not to be shown in the front end
        byImageStatus: "Select by image status",
        byLastSynchronized: "Last synchronized before",
        bulk: props.isConfigurationView ? undefined : "Bulk",
        collection: undefined // => not to be shown in the front end
      };
    },
    [props.isConfigurationView]
  );

  const [bulkOptions, bulkDescriptions] = React.useMemo<[
    Array<{ value: ScryfallBulkDataType; label: string }>,
    Record<ScryfallBulkDataType, string>
  ]>(
    () => {
      const options = new Array<{ value: ScryfallBulkDataType; label: string }>();
      const descriptions: Record<ScryfallBulkDataType, string> = {
        oracle_cards: "",
        unique_artwork: "",
        default_cards: "",
        all_cards: "",
        rulings: ""
      };
      const units = ["bytes", "KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
      const niceBytes = (x: number) => {
        let l = 0;
        while (x >= 1024 && ++l) {
          x = x / 1024;
        }
        return `${x.toFixed(x < 10 && l > 0 ? 1 : 0)} ${units[l]}`;
      };
      props.scryfallBulkItems?.forEach((o: IScryfallBulkDataItemDto) => {
        options.push({ value: o.type, label: `${o.name} (${niceBytes(o.size)})` });
        descriptions[o.type] = o.description;
      });
      return [options, descriptions];
    },
    [props.scryfallBulkItems]
  );
  //#endregion

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
                    if (value == "bulk") {
                      props.syncParam.syncCardSets = true;
                      props.syncParam.syncCardSymbols = true;
                      props.syncParam.rulingSyncType = "none";
                      props.syncParam.clearCatalogsToSync();
                    }
                    props.onSyncParamChanged(props.syncParam);
                  })
                }
                options={displayValueRecordToSelectOptions(cardSyncTypeDisplayValues)}
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

            {
              props.syncParam.cardSyncType == "bulk" &&
              <FormGroup key="bulk-sync-option">
                <HTMLSelect
                  fill={true}
                  minimal={true}
                  onChange={
                    handleValueChange((value: ScryfallBulkDataType) => {
                      props.syncParam.setBulkDefinition(props.scryfallBulkItems.find((d: IScryfallBulkDataItemDto) => d.type == value));
                      props.onSyncParamChanged(props.syncParam);
                    })
                  }
                  options={bulkOptions}
                  value={props.syncParam.bulkType}
                />
                <p>{bulkDescriptions[props.syncParam.bulkType]}</p>
              </FormGroup>
            }

            <FormGroup label="Rulings" labelFor="rulings-sync-type">
              <HTMLSelect
                disabled={props.syncParam.cardSyncType == "bulk"}
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
              disabled={props.syncParam.cardSyncType == "bulk"}
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
              disabled={props.syncParam.cardSyncType == "bulk"}
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
            disabled={props.syncParam.cardSyncType == "bulk"}
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
