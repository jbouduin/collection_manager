import { BaseLookupResult, IBaseColumn } from "../base";


export interface CardTableViewState {
  sortableColumnDefintions: Array<IBaseColumn<unknown, BaseLookupResult>>;
  sortedIndexMap: Array<number>;
}
