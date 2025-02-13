import { TreeNodeInfo } from "@blueprintjs/core";

export interface BaseTreeViewProps<TData, TFilter> {
  data: Array<TData>;
  filterProps: TFilter;
  onDataSelected: (sets: Array<TData>) => void;
  applyFilterProps: (data: Array<TData>, filterProps: TFilter) => Array<TData>;
  buildTree: (data: Array<TData>, filterProps: TFilter) => Array<TreeNodeInfo<TData | string>>;
}
