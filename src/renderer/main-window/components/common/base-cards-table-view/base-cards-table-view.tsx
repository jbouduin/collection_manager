import { Region, SelectionModes, Table2, Utils } from "@blueprintjs/table";
import * as React from "react";
import { BaseCardsTableViewState } from "./base-card-table-view.state";
import { BaseCardsTableViewProps } from "./base-cards-table-view.props";


export function BaseCardsTableView<T>(props: BaseCardsTableViewProps<T>) {
  //#region State -------------------------------------------------------------
  const initialState = {
    sortableColumnDefintions: props.sortableColumnDefintions,
    sortedIndexMap: new Array<number>()
  };
  const [state, setState] = React.useState<BaseCardsTableViewState>(initialState);
  //#endregion

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

  //#region Rendering ---------------------------------------------------------
  return (
    <div className="cards-table-wrapper">
      <Table2
        cellRendererDependencies={[props.data, state.sortedIndexMap]}
        children={state.sortableColumnDefintions.map((c) => c.getColumn(getCellData, sortColumn))}
        numRows={props.data?.length ?? 0}
        onSelection={onSelection}
        selectedRegionTransform={selectedRegionTransform}
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
