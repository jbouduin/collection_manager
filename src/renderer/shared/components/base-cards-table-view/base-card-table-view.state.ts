import { BaseLookupResult, IBaseColumn } from "..";


export interface BaseCardsTableViewState {
  sortableColumnDefintions: Array<IBaseColumn<unknown, BaseLookupResult>>;
  sortedIndexMap: Array<number>;
}
