import { TreeNodeInfo } from "@blueprintjs/core";
import { BaseTreeViewFilterProps } from "./base-tree-view-filter.props";
import { BaseTreeNodeViewmodel } from "./base-tree-node.viewmodel";


export interface BaseTreeViewProps<TData extends BaseTreeNodeViewmodel, TFilter> {
  data: Array<TData>;
  filterProps: BaseTreeViewFilterProps<TData, TFilter>;

  onDataSelected: (selectedData: Array<TData>) => void;
  buildTree: (data: Array<TData>, filterProps: TFilter) => Array<TreeNodeInfo<TData | string>>;
}
