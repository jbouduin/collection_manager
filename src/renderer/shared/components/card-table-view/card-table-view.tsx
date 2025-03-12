import { Region, SelectionModes, Table2, Utils } from "@blueprintjs/table";
import * as React from "react";
import { BaseTableViewProps, onDataSelected, selectedRegionTransformToRowSelection } from "../base";
import { CardTableViewState } from "./card-table-view.state";

// TODO if props.data changes clear the selected region -> be carefull: that makes the selected region stuff controlled
export function CardTableView<T>(props: BaseTableViewProps<T>) {
  //#region State -------------------------------------------------------------
  const initialState = {
    // TODO should this be state ? As long as we do not allow re-ordering columns by user probably not
    sortableColumnDefintions: props.sortableColumnDefintions,
    sortedIndexMap: new Array<number>()
  };
  const [state, setState] = React.useState<CardTableViewState>(initialState);
  //#endregion

  //#region Rendering ---------------------------------------------------------
  return (
    <div className="cards-table-wrapper">
      <Table2
        bodyContextMenuRenderer={props.bodyContextMenuRenderer}
        cellRendererDependencies={[props.data, state.sortedIndexMap]}
        children={state.sortableColumnDefintions.map((c) => c.getColumn(getCellData, sortColumn))}
        numRows={props.data?.length ?? 0}
        onSelection={(selectedRegions: Array<Region>) => onDataSelected(selectedRegions, props.data, (selected: Array<T>) => props.onDataSelected(selected))}
        selectedRegionTransform={(region: Region) => selectedRegionTransformToRowSelection(region)}
        selectionModes={SelectionModes.ROWS_AND_CELLS}
      />
    </div>
  );
  //#endregion

  //#region Auxiliary methods -------------------------------------------------
  function getCellData<U>(rowIndex: number, valueCallBack: (row: T) => U): U {
    const sortedRowIndex = state.sortedIndexMap[rowIndex];
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
    setState({ sortedIndexMap: sortedIndexMap, sortableColumnDefintions: state.sortableColumnDefintions });
  }
  //#endregion
}
