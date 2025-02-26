import { CellRenderer, Column, ColumnHeaderCell } from "@blueprintjs/table";
import * as React from "react";
import { BaseLookupResult } from "./base-lookup-result";
import { CellLookup, SortCallback } from "./types";


export interface IBaseColumn<T, U extends BaseLookupResult> {
  getColumn(getCellData: CellLookup<T, U>, sortColumn: SortCallback<T>): React.JSX.Element;
}

export abstract class BaseColumn<T, U extends BaseLookupResult> implements IBaseColumn<T, U> {
  //#region Protected fields --------------------------------------------------
  protected readonly index: number;
  protected readonly name: string;
  protected readonly valueCallBack: (row: T) => U;
  //#endregion

  //#region Constructor -------------------------------------------------------
  constructor(index: number, name: string, valueCallBack: (row: T) => U) {
    this.index = index;
    this.name = name;
    this.valueCallBack = valueCallBack;
  }
  //#endregion

  //#region IBaseColumn Implementation ----------------------------------------
  public getColumn(getCellData: CellLookup<T, U>, sortColumn: SortCallback<T>): React.JSX.Element {
    /* eslint-disable @typescript-eslint/no-unsafe-assignment */
    const menuRenderer = this.renderMenu.bind(this, sortColumn);
    return (
      <Column
        cellRenderer={this.getCellRenderer(getCellData)}
        columnHeaderCellRenderer={() => <ColumnHeaderCell menuRenderer={menuRenderer} name={this.name} />}
        key={this.index}
        name={this.name}
      />
    );
  }
  //#endregion

  //#region Abstract methods --------------------------------------------------
  protected abstract renderMenu(sortColumn: SortCallback<T>): React.JSX.Element;
  protected abstract getCellRenderer(getCellData: CellLookup<T, U>): CellRenderer;
  //#endregion
}
