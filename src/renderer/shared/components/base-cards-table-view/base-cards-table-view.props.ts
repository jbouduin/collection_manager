import { Props } from "@blueprintjs/core";
import { IBaseColumn } from "../base-table/base/base-column";
import { BaseLookupResult } from "..";


export interface BaseCardsTableViewProps<T> extends Props {
  data: Array<T>;
  sortableColumnDefintions: Array<IBaseColumn<unknown, BaseLookupResult>>;

  onCardsSelected(cards?: Array<T>): void;
}
