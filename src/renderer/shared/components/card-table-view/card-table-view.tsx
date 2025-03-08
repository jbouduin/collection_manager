import { Region, SelectionModes, Table2, Utils } from "@blueprintjs/table";
import * as React from "react";
import { BaseTableViewProps, onDataSelected, selectedRegionTransformToRowSelection } from "../base";
import { CardTableViewState } from "./card-table-view.state";

export function CardTableView<T>(props: BaseTableViewProps<T>) {
  //#region State -------------------------------------------------------------
  const initialState = {
    sortableColumnDefintions: props.sortableColumnDefintions,
    sortedIndexMap: new Array<number>()
  };
  const [state, setState] = React.useState<CardTableViewState>(initialState);
  //#endregion

  //#region Rendering ---------------------------------------------------------
  return (
    <div className="cards-table-wrapper">
      <Table2
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
