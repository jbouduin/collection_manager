import { DtoDatabaseTreeViewConfiguration } from "./database-view-tree-configuration.dto";

export interface DtoRendererConfiguration {
  useDarkTheme: boolean;
  databaseViewTreeConfiguration: DtoDatabaseTreeViewConfiguration;
  // FEATURE databaseViewTableConfiguration with column settings (columns to display, column order, default sort order...)
}
