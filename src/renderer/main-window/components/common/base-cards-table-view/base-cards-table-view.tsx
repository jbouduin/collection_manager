import { Region, SelectionModes, Table2 } from "@blueprintjs/table";
import { BaseCardsTableViewProps } from "./base-cards-table-view.props";
import * as React from "react";

export function BaseCardsTableView<T>(props: BaseCardsTableViewProps<T>) {
  //#region event handling ----------------------------------------------------
  function selectedRegionTransform(region: Region): Region {
    if (region.cols) {
      return { rows: region.rows };
    } else {
      return region;
    }
  }

  function onSelection(selectedRegions: Array<Region>): void {
    const selectedCards = new Array<T>();
    selectedRegions
      .filter((region: Region) => region.rows)
      .forEach((region: Region) => {
        const firstRow = region.rows[0];
        const lastRow = region.rows[1];
        for (let cnt = firstRow; cnt <= lastRow; cnt++) {
          selectedCards.push(props.data[cnt]);
        }
      });
    props.onCardsSelected(selectedCards);
  }

  //#region Main --------------------------------------------------------------
  return (
    <div className="cards-table-wrapper">
      <Table2
        numRows={props.data?.length ?? 0}
        selectionModes={SelectionModes.ROWS_AND_CELLS}
        onSelection={onSelection}
        selectedRegionTransform={selectedRegionTransform}
        children={props.columnDefinitions}
      />
    </div>
  );
  //#endregion
}
