import { TreeNodeInfo } from "@blueprintjs/core";
import { BaseTreeViewFilterProps } from "./base-tree-view-filter.props";
import { IBaseTreeNodeViewmodel } from "./base-tree-node.viewmodel";


export interface BaseTreeViewProps<TData extends IBaseTreeNodeViewmodel, TFilter> {
  buildTree: (data: Array<TData>, filterProps: TFilter) => Array<TreeNodeInfo<TData | string>>;
  data: Array<TData>;
  filterProps: BaseTreeViewFilterProps<TData, TFilter>;
  onDataSelected: (selectedData: Array<TData>) => void;
}
