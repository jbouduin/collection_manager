import { Checkbox, FormGroup, HTMLSelect, HTMLTable } from "@blueprintjs/core";
import * as React from "react";
import { CardSetGroupBy, CardSetSort, CardSetType } from "../../../../../common/types";
import { DisplayValueService, DisplayValueServiceContext } from "../../../context";
import { displayValueMapToSelectOptions, handleBooleanChange, handleValueChange } from "../../../utils";
import { DatabaseViewConfigurationViewProps } from "./database-view-configuration-view.props";


export function DatabaseViewConfigurationView(props: DatabaseViewConfigurationViewProps) {
  //#region Rendering ---------------------------------------------------------
  return (
    <DisplayValueServiceContext.Consumer>
      {
        (displayValueService: DisplayValueService) => (
          <>
            <FormGroup label="Sort sets in tree by" labelFor="sort-sets-by">
              <HTMLSelect
                id="sort-sets-by"
                onChange={
                  handleValueChange((value: CardSetSort) => {
                    props.configuration.cardSetSort = value;
                    props.onConfigurationChanged();
                  })
                }
                options={displayValueMapToSelectOptions(displayValueService.cardSetSortDisplayValues)}
                value={props.configuration.cardSetSort}
              />
            </FormGroup>
            <FormGroup label="Group sets in tree by" labelFor="group-sets-by">
              <HTMLSelect
                id="group-sets-by"
                onChange={
                  handleValueChange((value: CardSetGroupBy) => {
                    props.configuration.cardSetGroupBy = value;
                    props.onConfigurationChanged();
                  })
                }
                options={displayValueMapToSelectOptions(displayValueService.cardSetGroupByDisplayValues)}
                value={props.configuration.cardSetGroupBy}
              />
            </FormGroup>
            <HTMLTable
              bordered={false}
              compact={true}
              key="catalogs"
              width="100%"
            >
              <thead>
                <tr><td colSpan={3} style={{ paddingLeft: "0px" }}>Set types filter</td></tr>
              </thead>
              <tbody>
                {
                  renderDefaultSetTypes(displayValueService)
                }
              </tbody>
            </HTMLTable >
          </>
        )
      }
    </DisplayValueServiceContext.Consumer>
  );

  function renderDefaultSetTypes(displayValueService: DisplayValueService): Array<React.JSX.Element> {
    const table = new Array<React.JSX.Element>();
    let currentRow: Array<React.JSX.Element>;
    let idx = 0;
    displayValueService.cardSetTypeDisplayValues.forEach((displayValue: string, key: CardSetType) => {
      if (idx % 3 == 0) {
        currentRow = new Array<React.JSX.Element>();
      }
      currentRow.push((
        <td key={`cell-${key}`} style={{ paddingLeft: "0px" }} >
          <Checkbox
            checked={props.configuration.cardSetTypeFilter.indexOf(key) >= 0}
            key={key}
            label={displayValue}
            onChange={
              handleBooleanChange((_value: boolean) => {
                props.configuration.toggleCardSetFilterType(key);
                props.onConfigurationChanged();
              })
            }
          />
        </td>
      ));
      if (idx % 3 == 1) {
        table.push((
          <tr key={`row-${idx}`}>
            {currentRow}
          </tr>
        ));
      }
      idx = idx + 1;
    });
    return table;
  }
  //#endregion
}
