import { Region, SelectionModes, Table2, Utils } from "@blueprintjs/table";
import * as React from "react";
import { BaseTableViewProps, onDataSelected, selectedRegionTransformToRowSelection } from "../base";

// TODO if props.data changes clear the selected region -> be carefull: that makes the selected region stuff controlled
export function CardTableView<T>(props: BaseTableViewProps<T>) {
  //#region Rendering ---------------------------------------------------------
  return (
    <div className="cards-table-wrapper">
      <Table2
        bodyContextMenuRenderer={props.bodyContextMenuRenderer}
        // BUG it looks like not all cells are re-rendered when required. e.g. Mana Cost, Rarity (all non standard text columns ???)
        cellRendererDependencies={[props.data, props.sortedIndexMap]}
        children={props.sortableColumnDefintions.map((c) => c.getColumn(getCellData, sortColumn))}
        numRows={props.data?.length ?? 0}
        onSelection={(selectedRegions: Array<Region>) => onDataSelected(selectedRegions, props.data, props.sortedIndexMap, (selected: Array<T>) => props.onDataSelected(selected))}
        selectedRegionTransform={(region: Region) => selectedRegionTransformToRowSelection(region)}
        selectionModes={SelectionModes.ROWS_AND_CELLS}
      />
    </div>
  );
  //#endregion

  //#region Auxiliary methods -------------------------------------------------
  function getCellData<U>(rowIndex: number, valueCallBack: (row: T) => U): U {
    const sortedRowIndex = props.sortedIndexMap[rowIndex];
    if (sortedRowIndex != null) {
      rowIndex = sortedRowIndex;
    }
    return valueCallBack(props.data[rowIndex]);
  }

  function sortColumn(comparator: (a: T, b: T) => number) {
    const sortedIndexMap = Utils.times(props.data.length, (i: number) => i);
    sortedIndexMap.sort((a: number, b: number) => {
      return comparator(props.data[a], props.data[b]);
    });
    props.onColumnSorted(sortedIndexMap);
  }
  //#endregion
}
