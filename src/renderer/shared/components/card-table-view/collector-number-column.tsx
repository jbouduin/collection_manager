import { Menu, MenuItem } from "@blueprintjs/core";
import { Cell, CellRenderer } from "@blueprintjs/table";
import * as React from "react";
import { BaseColumn, CellLookup, SortCallback } from "../base";
import { CollectiorNumberLookupResult } from "./collector-number-lookup-result";


export class CollectiorNumberColumn<T> extends BaseColumn<T, CollectiorNumberLookupResult> {
  //#region SortableColumn abstract methods implementationm -------------------
  protected renderMenu(sortColumn: SortCallback<T>): React.JSX.Element {
    const sortAsc = () => sortColumn((a, b) => this.compare(a, b));
    const sortDesc = () => sortColumn((a, b) => this.compare(b, a));
    return (
      <Menu>
        <MenuItem icon="sort-asc" onClick={sortAsc} text="Sort Asc" />
        <MenuItem icon="sort-desc" onClick={sortDesc} text="Sort Desc" />
      </Menu>
    );
  }

  protected getCellRenderer(getCellData: CellLookup<T, CollectiorNumberLookupResult>): CellRenderer {
    return (rowIdx: number, _colIdx: number) => (<Cell>{getCellData(rowIdx, this.valueCallBack).displayValue}</Cell>);
  }
  //#endregion

  //#region Auxiliary methods -------------------------------------------------
  private compare(a: T, b: T): number {
    const valueA = this.valueCallBack(a);
    const valueB = this.valueCallBack(b);
    return valueA.defaultSortColumn.localeCompare(valueB.defaultSortColumn);
  }
  //#endregion
}
