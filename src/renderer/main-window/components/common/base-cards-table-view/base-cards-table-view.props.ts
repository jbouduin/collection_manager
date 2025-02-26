import { Props } from "@blueprintjs/core";
import { IBaseColumn } from "./columns/base-column";
import { BaseLookupResult } from "./columns";


export interface BaseCardsTableViewProps<T> extends Props {
  data: Array<T>;
  sortableColumnDefintions: Array<IBaseColumn<unknown, BaseLookupResult>>;

  onCardsSelected(cards?: Array<T>): void;
}
