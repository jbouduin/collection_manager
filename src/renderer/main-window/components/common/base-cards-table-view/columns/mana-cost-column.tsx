import { Menu, MenuItem } from "@blueprintjs/core";
import { Cell, CellRenderer } from "@blueprintjs/table";
import * as React from "react";
import { CardSymbolRenderer } from "../../card-symbol-renderer";
import { BaseColumn } from "./base-column";
import { ManaCostLookupResult } from "./mana-cost-lookup-result";
import { CellLookup, SortCallback } from "./types";


export class ManaCostColumn<T> extends BaseColumn<T, ManaCostLookupResult> {
  //#region SortableColumn abstract methods implementationm -------------------
  protected renderMenu(sortColumn: SortCallback<T>): React.JSX.Element {
    const sortAsc = () => sortColumn((a, b) => this.compare(a, b));
    const sortDesc = () => sortColumn((a, b) => this.compare(b, a));
    // TODO add sort by minimal CMC - sort by maximal CMC for two face cards
    return (
      <Menu>
        <MenuItem icon="sort-asc" onClick={sortAsc} text="Sort Asc" />
        <MenuItem icon="sort-desc" onClick={sortDesc} text="Sort Desc" />
      </Menu>
    );
  }

  protected getCellRenderer(getCellData: CellLookup<T, ManaCostLookupResult>): CellRenderer {
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
  //#endregion

  //#region Auxiliary methods -------------------------------------------------
  private compare(a: T, b: T): number {
    const valueA = this.valueCallBack(a);
    const valueB = this.valueCallBack(b);
    const valueCompare = valueA.convertedManaCost - valueB.convertedManaCost;
    if (valueCompare == 0) {
      return valueA.collectorNumberSortValue.localeCompare(valueB.collectorNumberSortValue);
    } else {
      return valueCompare;
    }
  }
  //#endregion
}
