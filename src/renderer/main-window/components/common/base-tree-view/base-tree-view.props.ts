import { TreeNodeInfo } from "@blueprintjs/core";
import { BaseTreeViewFilterProps } from "./base-tree-view-filter.props";


export interface BaseTreeViewProps<TData, TFilter> {
  data: Array<TData>;
  filterProps: BaseTreeViewFilterProps<TData, TFilter>;

  onDataSelected: (sets: Array<TData>) => void;
  buildTree: (data: Array<TData>, filterProps: TFilter) => Array<TreeNodeInfo<TData | string>>;
}
