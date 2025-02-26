import { BaseLookupResult, IBaseColumn } from "./columns";


export interface BaseCardsTableViewState {
  sortableColumnDefintions: Array<IBaseColumn<unknown, BaseLookupResult>>;
  sortedIndexMap: Array<number>;
}
