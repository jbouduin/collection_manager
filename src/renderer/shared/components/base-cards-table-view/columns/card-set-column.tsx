import { Menu, MenuItem } from "@blueprintjs/core";
import { Cell, CellRenderer } from "@blueprintjs/table";
import * as React from "react";
import { BaseColumn, CellLookup, SortCallback } from "../../base-table";
import { CardSetLookupResult } from "./card-set-lookup-result";
import { getRarityColorClassname } from "../../utils";
import { SvgProvider } from "../../svg-provider";


export class CardSetColumn<T> extends BaseColumn<T, CardSetLookupResult> {
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

  protected getCellRenderer(getCellData: CellLookup<T, CardSetLookupResult>): CellRenderer {
    return (rowIdx: number, _colIdx: number) => {
      const cellValue = getCellData(rowIdx, this.valueCallBack);
      return (
        <Cell>
          {cellValue.svg && <SvgProvider className={getRarityColorClassname(cellValue.rarity)} svg={cellValue.svg} />}
          {cellValue.cardSetName}
        </Cell>
      );
    };
  }
  //#endregion

  //#region Auxiliary methods -------------------------------------------------
  private compare(a: T, b: T): number {
    const valueA = this.valueCallBack(a);
    const valueB = this.valueCallBack(b);
    const valueCompare = valueA.cardSetName.localeCompare(valueB.cardSetName);
    if (valueCompare == 0) {
      return valueA.defaultSortColumn.localeCompare(valueB.defaultSortColumn);
    } else {
      return valueCompare;
    }
  }
  //#endregion
}
