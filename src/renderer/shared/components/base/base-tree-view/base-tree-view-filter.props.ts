export interface BaseTreeViewFilterProps<TData, TFilter> {
  filter: TFilter;
  applyFilterProps: (data: Array<TData>, filterProps: TFilter) => Array<TData>;
}
