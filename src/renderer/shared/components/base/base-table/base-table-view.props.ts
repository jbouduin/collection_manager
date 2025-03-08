import { CollectionManagerProps } from "../collection-manager.props";
import { IBaseColumn } from "./base-column";
import { BaseLookupResult } from "./base-lookup-result";


export interface BaseTableViewProps<T> extends CollectionManagerProps {
  data: Array<T>;
  sortableColumnDefintions: Array<IBaseColumn<unknown, BaseLookupResult>>;
  onDataSelected(cards?: Array<T>): void;
}
