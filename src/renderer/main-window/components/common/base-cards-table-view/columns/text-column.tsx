import { Menu, MenuItem } from "@blueprintjs/core";
import { Cell, CellRenderer } from "@blueprintjs/table";
import * as React from "react";
import { BaseColumn } from "./base-column";
import { TextLookupResult } from "./text-lookup-result";
import { CellLookup, SortCallback } from "./types";


export class TextColumn<T> extends BaseColumn<T, TextLookupResult> {
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

  protected getCellRenderer(getCellData: CellLookup<T, TextLookupResult>): CellRenderer {
    return (rowIdx: number, _colIdx: number) => (<Cell>{getCellData(rowIdx, this.valueCallBack).textValue}</Cell>);
  }
  //#endregion

  //#region Auxiliary methods -------------------------------------------------
  private compare(a: T, b: T): number {
    const valueA = this.valueCallBack(a);
    const valueB = this.valueCallBack(b);
    const valueCompare = valueA.textValue.localeCompare(valueB.textValue);
    if (valueCompare == 0) {
      return valueA.collectorNumberSortValue.localeCompare(valueB.collectorNumberSortValue);
    } else {
      return valueCompare;
    }
  }
  //#endregion
}
