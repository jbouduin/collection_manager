import { DatabaseTreeViewConfigurationDto } from "./database-view-tree-configuration.dto";

export interface RendererConfigurationDto {
  useDarkTheme: boolean;
  logServerResponses: boolean;
  databaseViewTreeConfiguration: DatabaseTreeViewConfigurationDto;
  // FEATURE databaseViewTableConfiguration with column settings (columns to display, column order, default sort order...)
}
