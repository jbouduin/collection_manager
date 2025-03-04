import { Menu, MenuItem } from "@blueprintjs/core";
import { Cell, CellRenderer } from "@blueprintjs/table";
import * as React from "react";
import { CardSymbolRenderer } from "../card-symbol-renderer";
import { BaseColumn, CellLookup, SortCallback } from "../base-table";
import { ColorIdentityLookupResult } from "./color-identity-lookup-result";


export class ColorIdentityColumn<T> extends BaseColumn<T, ColorIdentityLookupResult> {
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
  //#endregion

  //#region Auxiliary methods -------------------------------------------------
  protected getCellRenderer(getCellData: CellLookup<T, ColorIdentityLookupResult>): CellRenderer {
    return (rowIdx: number, _colIdx: number) => {
      return (
        <Cell>
          <CardSymbolRenderer
            cardSymbols={getCellData(rowIdx, this.valueCallBack).symbols}
            className="mana-cost-image-in-table"
          />
        </Cell >
      );
    };
  }

  private compare(a: T, b: T): number {
    const valueA = this.valueCallBack(a);
    const valueB = this.valueCallBack(b);
    const valueCompare = valueA.colorIdentitySortValue.localeCompare(valueB.colorIdentitySortValue);
    if (valueCompare == 0) {
      return valueA.defaultSortColumn.localeCompare(valueB.defaultSortColumn);
    } else {
      return valueCompare;
    }
  }
  //#endregion
}
