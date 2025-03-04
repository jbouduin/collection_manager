import { BaseLookupResult, IBaseColumn } from "..";


export interface BaseCardTableViewState {
  sortableColumnDefintions: Array<IBaseColumn<unknown, BaseLookupResult>>;
  sortedIndexMap: Array<number>;
}
